// App.tsx
import { Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import "./index.css";
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import Cart from "./pages/Cart";
import FavoritePage from "./pages/FavoritePage";
import CheckoutRoute from "./components/checkout/CheckoutRoute";
import Contact from "./pages/ContactPage";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import EventPage from "./pages/EventPage";
import EatsPage from "./pages/EatsPage";
import HotOffersPage from "./pages/HotOffersPage";
import BlogPage from "./pages/BlogPage";
import { RoleRoute } from "./components/RoleRoute";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/checkout" element={<CheckoutRoute />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/eats" element={<EatsPage />} />
          <Route path="/offers" element={<HotOffersPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Route>

        {/* Standalone admin console — dedicated layout for scalability */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </ReactLenis>
  );
}
