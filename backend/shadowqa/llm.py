"""LLM client with provider fallback and strict JSON extraction."""
import json
import re
import time
import uuid

from emergentintegrations.llm.chat import LlmChat, UserMessage

from .config import settings
from .db import llm_log, now_iso


class LLMUnavailable(Exception):
    pass


def _providers() -> list[tuple[str, str]]:
    out: list[tuple[str, str]] = []
    for spec in (settings.primary_model, settings.fallback_model):
        if spec and ":" in spec:
            provider, model = spec.split(":", 1)
            if settings.key_for(provider):
                out.append((provider, model))
    return out


def extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("no JSON object in model response")
    candidate = text[start:end + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        candidate = re.sub(r",\s*([}\]])", r"\1", candidate)
        return json.loads(candidate)


async def complete_json(system: str, user: str, purpose: str, incident_id: str | None = None, max_tokens: int = 7000) -> tuple[dict, dict]:
    errors: list[str] = []
    for provider, model in _providers():
        started = time.time()
        try:
            chat = LlmChat(api_key=settings.key_for(provider), session_id=f"sqa-{uuid.uuid4()}", system_message=system)
            chat.with_model(provider, model).with_params(max_tokens=max_tokens, temperature=0.1)
            text = await chat.send_message(UserMessage(text=user))
            data = extract_json(text)
            meta = {"provider": provider, "model": model, "latency_ms": int((time.time() - started) * 1000),
                    "prompt_chars": len(system) + len(user), "response_chars": len(text), "fallback_used": bool(errors)}
            await llm_log.insert_one({"ts": now_iso(), "incident_id": incident_id, "purpose": purpose, **meta, "ok": True})
            return data, meta
        except Exception as exc:  # provider failure → try the next one
            msg = f"{provider}:{model} → {type(exc).__name__}: {str(exc)[:300]}"
            errors.append(msg)
            await llm_log.insert_one({"ts": now_iso(), "incident_id": incident_id, "purpose": purpose, "provider": provider,
                                      "model": model, "ok": False, "error": msg,
                                      "latency_ms": int((time.time() - started) * 1000)})
    raise LLMUnavailable("; ".join(errors) or "no LLM provider configured")
