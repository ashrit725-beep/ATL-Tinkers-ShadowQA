import os
import random
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

from .catalog import PRODUCTS, SEED_ORDERS

router = APIRouter(prefix="/api/demo", tags=["demo-store"])

_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
_db = _client[os.environ["DB_NAME"]]
sessions = _db.demo_sessions
orders = _db.demo_orders
settings_col = _db.demo_settings

DEMO_PASSWORD = "lumen-demo"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Customer(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    address: str = Field(min_length=1, max_length=160)
    city: str = Field(min_length=1, max_length=80)
    postal_code: str = Field(min_length=3, max_length=12)


class Card(BaseModel):
    number: str = Field(min_length=12, max_length=23)
    exp: str = Field(min_length=4, max_length=7)
    cvc: str = Field(min_length=3, max_length=4)


class LineItem(BaseModel):
    product_id: str
    qty: int = Field(ge=1, le=20)


class PaymentRequest(BaseModel):
    """Payment gateway contract. `amount` is the authoritative charge total in major units."""
    amount: float = Field(gt=0)
    currency: str = "USD"
    items: list[LineItem]
    customer: Customer
    card: Card


class Preferences(BaseModel):
    email_digest: bool = True
    order_updates: bool = True
    marketing: bool = False
    units: str = "imperial"
    theme: str = "light"


async def _user(authorization: str | None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="not authenticated")
    session = await sessions.find_one({"token": authorization[7:]}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="session expired")
    return session


async def _ensure_seed(email: str) -> None:
    if await orders.count_documents({"email": email}) == 0:
        await orders.insert_many([{**o, "email": email} for o in SEED_ORDERS])


@router.post("/auth/login")
async def login(body: LoginRequest):
    if body.password != DEMO_PASSWORD:
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = uuid.uuid4().hex
    name = body.email.split("@")[0].replace(".", " ").title()
    session = {"token": token, "email": body.email, "name": name, "created_at": _now(), "member_since": "2024-03-11"}
    await sessions.insert_one(dict(session))
    await _ensure_seed(body.email)
    return {"token": token, "user": {"email": body.email, "name": name, "member_since": session["member_since"]}}


@router.get("/auth/me")
async def me(authorization: str | None = Header(default=None)):
    s = await _user(authorization)
    return {"email": s["email"], "name": s["name"], "member_since": s.get("member_since")}


@router.get("/products")
async def list_products(category: str | None = None):
    items = [p for p in PRODUCTS if not category or p["category"] == category]
    return {"products": items, "categories": sorted({p["category"] for p in PRODUCTS})}


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    for p in PRODUCTS:
        if p["id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="product not found")


@router.get("/dashboard")
async def dashboard(authorization: str | None = Header(default=None)):
    s = await _user(authorization)
    docs = await orders.find({"email": s["email"]}, {"_id": 0}).sort("created_at", -1).to_list(50)
    spend = round(sum(o["amount"] for o in docs), 2)
    items = sum(i["qty"] for o in docs for i in o["items"])
    return {
        "user": {"name": s["name"], "email": s["email"]},
        "stats": {"orders": len(docs), "spend": spend, "items": items, "open": sum(1 for o in docs if o["status"] != "delivered")},
        "recent_orders": docs[:5],
        "featured": PRODUCTS[:3],
    }


@router.get("/orders")
async def list_orders(authorization: str | None = Header(default=None)):
    s = await _user(authorization)
    docs = await orders.find({"email": s["email"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"orders": docs}


@router.get("/orders/{order_id}")
async def get_order(order_id: str, authorization: str | None = Header(default=None)):
    s = await _user(authorization)
    doc = await orders.find_one({"email": s["email"], "id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="order not found")
    return doc


@router.post("/payment")
async def create_payment(body: PaymentRequest, authorization: str | None = Header(default=None)):
    s = await _user(authorization)
    digits = "".join(ch for ch in body.card.number if ch.isdigit())
    if not digits.startswith("4242"):
        raise HTTPException(status_code=402, detail={"code": "card_declined", "message": "Card declined by issuer (use test card 4242…)"})
    catalog = {p["id"]: p for p in PRODUCTS}
    line_items = []
    for item in body.items:
        product = catalog.get(item.product_id)
        if not product:
            raise HTTPException(status_code=400, detail={"code": "unknown_product", "product_id": item.product_id})
        line_items.append({"product_id": product["id"], "name": product["name"], "qty": item.qty, "price": product["price"]})
    order_id = f"LUM-{random.randint(8900, 9999)}"
    txn_id = f"txn_{uuid.uuid4().hex[:16]}"
    order = {"id": order_id, "email": s["email"], "created_at": _now(), "status": "processing", "amount": round(body.amount, 2),
             "currency": body.currency, "items": line_items, "transaction_id": txn_id, "customer": body.customer.model_dump()}
    await orders.insert_one(dict(order))
    return {"transactionId": txn_id, "orderId": order_id, "status": "succeeded", "amount": order["amount"], "currency": body.currency,
            "createdAt": order["created_at"]}


@router.get("/settings")
async def get_settings(authorization: str | None = Header(default=None)):
    s = await _user(authorization)
    doc = await settings_col.find_one({"email": s["email"]}, {"_id": 0, "email": 0})
    return {"preferences": doc or Preferences().model_dump()}


@router.put("/settings")
async def put_settings(body: Preferences, authorization: str | None = Header(default=None)):
    s = await _user(authorization)
    await settings_col.replace_one({"email": s["email"]}, {"email": s["email"], **body.model_dump()}, upsert=True)
    return {"preferences": body.model_dump(), "saved_at": _now()}
