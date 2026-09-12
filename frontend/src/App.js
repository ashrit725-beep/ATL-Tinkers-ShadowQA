import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/demo/store/AuthContext";
import { CartProvider } from "@/demo/store/CartContext";
import { Layout } from "@/demo/components/Layout";
import { ErrorBoundary } from "@/demo/components/ErrorBoundary";
import Login from "@/demo/pages/Login";
import Dashboard from "@/demo/pages/Dashboard";
import Products from "@/demo/pages/Products";
import ProductDetail from "@/demo/pages/ProductDetail";
import Cart from "@/demo/pages/Cart";
import Checkout from "@/demo/pages/Checkout";
import Orders from "@/demo/pages/Orders";
import Settings from "@/demo/pages/Settings";

function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <Protected>
                    <Layout />
                  </Protected>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
