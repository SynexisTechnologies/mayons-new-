// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import MainLayout from "./layout/MainLayout";
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
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleRoute } from "./components/RoleRoute";
import AdminPage from "./pages/AdminPanel";
import BlogPage from "./pages/BlogPage";

export default function App() {
  return (
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
<Route
  path="/"
  element={
    <ProtectedRoute>
      <RoleRoute allowedRoles={["user"]}>
      </RoleRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
      <RoleRoute allowedRoles={["admin"]}>
        <AdminPage />
      </RoleRoute>  
  }
/>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
