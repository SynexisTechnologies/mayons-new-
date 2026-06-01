import { useEffect, useState } from "react";
import AdminStats from "../components/admin/AdminStats";
import ProductForm from "../components/admin/ProductForm";
import ProductTable from "../components/admin/ProductTable";
import OrdersTable from "../components/admin/OrderTable";
import { getProducts, getSoldSummary } from "../services/AdminServices";
import { Product } from "../components/product/types";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    const data = await getProducts();
    setProducts(data);
    setSummary(await getSoldSummary());
  };

  useEffect(() => { loadData(); }, []);

  const soldOut = products.filter((p) => p.stock <= 0).length;

  return (
    <main className="bg-slate-50 min-h-screen pt-36 pb-16">

      {/* Page header */}
      <div className="px-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {products.length} products total
              {soldOut > 0 && (
                <span className="ml-2 text-red-500 font-medium">· {soldOut} sold out</span>
              )}
            </p>
          </div>

          {activeTab === "products" && (
            <button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="bg-[#d4af37] text-[#1e3a5f] px-6 py-2.5 rounded-xl font-semibold shadow hover:scale-105 transition w-full md:w-auto text-sm"
            >
              + Add New Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition ${
                activeTab === tab.key
                  ? "bg-white border border-b-white border-gray-200 text-[#1e3a5f] -mb-px"
                  : "text-gray-500 hover:text-[#1e3a5f]"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <AdminStats />
            {soldOut > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-sm text-red-700">
                <strong>{soldOut} products</strong> are out of stock. Go to the Products tab to restock them.
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <ProductTable
            products={products}
            onEdit={(p: Product) => { setEditing(p); setShowModal(true); }}
            refresh={loadData}
          />
        )}

        {activeTab === "orders" && <OrdersTable />}
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
