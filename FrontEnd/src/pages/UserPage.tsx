// src/pages/UserPage.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function UserPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">User Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">My Profile</h2>
          <p className="text-gray-600">View and edit your profile information.</p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">My Orders</h2>
          <p className="text-gray-600">Check your orders and order status.</p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Settings</h2>
          <p className="text-gray-600">Update your account preferences and password.</p>
        </div>
      </section>

      <footer className="mt-12 text-center text-gray-500">
        Logged in as: <span className="font-semibold">{user?.email}</span>
      </footer>
    </div>
  );
}
