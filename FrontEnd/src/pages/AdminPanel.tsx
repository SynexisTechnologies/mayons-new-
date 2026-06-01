import { useEffect, useState } from "react";
import AdminStats from "../components/admin/AdminStats";
import ProductForm from "../components/admin/ProductForm";
import ProductTable from "../components/admin/ProductTable";
import OrdersTable from "../components/admin/OrderTable";
import UsersTable from "../components/admin/UsersTable";
import { getProducts } from "../services/AdminServices";
import { Product } from "../components/product/types";
import {
  LayoutDashboard, Package, ClipboardList, Users, Plus, AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "overview",  label: "Overview",  icon: LayoutDashboard },
  { key: "products",  label: "Products",  icon: Package },
  { key: "orders",    label: "Orders",    icon: ClipboardList },
  { key: "users",     label: "Users",     icon: Users },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => { loadData(); }, []);

  const soldOut = products.filter((p) => p.stock <= 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return (
    <main className="bg-slate-50/70 min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full">
                Admin
              </span>
              {user && (
                <span className="text-xs text-slate-400">
                  Signed in as <span className="font-semibold text-[#1e3a5f]">{user.firstName} {user.lastName}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e3a5f]">Admin Panel</h1>
          </div>

          {activeTab === "products" && (
            <button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2a4a7c] transition shadow-sm text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          )}
        </div>

        {/* ── Alert banners ───────────────────────────────────────────────── */}
        {(soldOut > 0 || lowStock > 0) && activeTab === "overview" && (
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {soldOut > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-red-700">
                  <strong>{soldOut} product{soldOut > 1 ? "s" : ""}</strong> out of stock
                </span>
                <button onClick={() => setActiveTab("products")}
                  className="ml-auto text-xs text-red-600 underline underline-offset-2 cursor-pointer hover:text-red-800">
                  View
                </button>
              </div>
            )}
            {lowStock > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-amber-700">
                  <strong>{lowStock} product{lowStock > 1 ? "s" : ""}</strong> low stock (≤ 5)
                </span>
                <button onClick={() => setActiveTab("products")}
                  className="ml-auto text-xs text-amber-600 underline underline-offset-2 cursor-pointer hover:text-amber-800">
                  View
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab bar ─────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm mb-6 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const badge =
              tab.key === "products" ? products.length :
              tab.key === "orders"   ? null :
              null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-[#1e3a5f] text-white shadow-sm"
                    : "text-slate-500 hover:text-[#1e3a5f] hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {badge !== null && badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ─────────────────────────────────────────────────── */}
        <div>
          {activeTab === "overview" && <AdminStats />}
          {activeTab === "products" && (
            <ProductTable
              products={products}
              onEdit={(p: Product) => { setEditing(p); setShowModal(true); }}
              refresh={loadData}
            />
          )}
          {activeTab === "orders" && <OrdersTable />}
          {activeTab === "users" && <UsersTable />}
        </div>
      </div>

      {showModal && (
        <ProductForm
          fetchProducts={loadData}
          editingProduct={editing}
          setEditingProduct={setEditing}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
