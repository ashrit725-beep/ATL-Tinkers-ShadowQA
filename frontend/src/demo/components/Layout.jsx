import { Link, NavLink, Outlet } from "react-router-dom";
import { ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";

const links = [
  { to: "/", label: "Dashboard", testid: "nav-dashboard" },
  { to: "/products", label: "Products", testid: "nav-products" },
  { to: "/orders", label: "Orders", testid: "nav-orders" },
  { to: "/settings", label: "Settings", testid: "nav-settings" },
];

export function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-8">
          <Link to="/" className="font-display text-xl tracking-tight text-ink" data-testid="brand-link">
            Lumen <span className="italic font-light">Supply Co.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1" data-testid="main-nav">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={l.testid}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm transition-colors duration-200 ${isActive ? "text-ink font-medium" : "text-ink2 hover:text-ink"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative inline-flex items-center gap-2 text-sm text-ink" data-testid="nav-cart">
              <ShoppingBag size={18} strokeWidth={1.75} />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-amber text-canvas text-[10px] font-mono flex items-center justify-center" data-testid="cart-count">
                  {count}
                </span>
              )}
            </Link>
            <span className="hidden sm:block text-xs text-ink2 font-mono" data-testid="user-email">{user?.email}</span>
            <button onClick={logout} className="text-ink2 hover:text-ink transition-colors" title="Sign out" data-testid="logout-btn">
              <LogOut size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between text-xs text-mute font-mono">
          <span>© 2026 Lumen Supply Co. — Field-grade goods</span>
          <span>Instrumented by ShadowQA · press Ctrl+Shift+Q for the inspector</span>
        </div>
      </footer>
    </div>
  );
}
