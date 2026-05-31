import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, ShoppingBag, Settings, LogOut, ChevronRight } from "lucide-react";

export default function UserPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const cards = [
    { icon: User, title: "My Profile", desc: "View and edit your personal information.", color: "bg-[#1e3a5f]/8 text-[#1e3a5f]" },
    { icon: ShoppingBag, title: "My Orders", desc: "Track your current and past orders.", color: "bg-[#d4af37]/15 text-[#d4af37]" },
    { icon: Settings, title: "Settings", desc: "Manage your account preferences.", color: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Profile banner */}
        <div className="bg-[#1e3a5f] rounded-2xl p-6 sm:p-8 mb-8 flex items-center justify-between flex-wrap gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#d4af37] rounded-full flex items-center justify-center text-[#1e3a5f] font-extrabold text-xl shadow">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="text-white">
              <p className="font-bold text-xl">{user?.firstName} {user?.lastName}</p>
              <p className="text-white/60 text-sm">{user?.email}</p>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded-full mt-1">
                {user?.role || "User"}
              </span>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400/40 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition text-sm font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {cards.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-[#1e3a5f] mb-1">{title}</h2>
              <p className="text-slate-400 text-sm">{desc}</p>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#d4af37] mt-3 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
