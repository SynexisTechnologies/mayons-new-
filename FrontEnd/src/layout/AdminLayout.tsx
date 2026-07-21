import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ClipboardList, Users, FolderTree,
  FileText, Tag, ExternalLink, LogOut, Menu, X,
} from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/users", label: "Users", icon: Users },
];

const SOON = [
  { label: "Blogs", icon: FileText },
  { label: "Offers", icon: Tag },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <button onClick={() => navigate("/")} className="block">
          <Logo height={42} width={120} />
        </button>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-honey-light/80 mt-2 pl-1">
          Admin Console
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1" data-lenis-prevent>
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 px-3 mb-2">
          Manage
        </p>
        {NAV.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? "bg-honey-light text-ink shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}

        <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 px-3 mb-2 mt-6">
          Coming soon
        </p>
        {SOON.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/30 cursor-not-allowed"
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className="ml-auto text-[9px] font-bold tracking-wide uppercase bg-white/10 text-white/50 px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition"
        >
          <ExternalLink className="w-4 h-4" /> View site
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-clay/80 transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-evergreen fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-evergreen">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-stone-500 hover:text-evergreen"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg font-semibold text-ink">Admin Panel</h1>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-ink leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[11px] text-stone-400 leading-tight">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-evergreen text-white flex items-center justify-center text-sm font-bold shrink-0">
                {(user.firstName?.[0] || "A").toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Routed content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
