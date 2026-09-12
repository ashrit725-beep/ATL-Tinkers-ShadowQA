import { request } from "../lib/api";

export const login = (email, password) => request("/auth/login", { method: "POST", body: { email, password } });
export const fetchProducts = () => request("/products");
export const fetchProduct = (id) => request(`/products/${id}`);
export const fetchDashboard = () => request("/dashboard");
export const fetchOrders = () => request("/orders");
export const fetchSettings = () => request("/settings");
export const saveSettings = (preferences) => request("/settings", { method: "PUT", body: preferences });
