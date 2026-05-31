import { useEffect, useState } from "react";
import AdminStats from "../components/admin/AdminStats";
import ProductForm from "../components/admin/ProductForm";
import ProductTable from "../components/admin/ProductTable";
import OrdersTable from "../components/admin/OrderTable";
import { getProducts, getSoldSummary } from "../services/AdminServices";
import { Product } from "../components/product/types";

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const soldOutProducts = products.filter(p => p.stock <= 0);

  const loadData = async () => {
    const data = await getProducts();
    setProducts(data);
    setSummary(await getSoldSummary());
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="bg-[#1e3a5f]/5 min-h-screen pt-32 px-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">
          Admin Panel
        </h1>

        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
  className="bg-[#d4af37] text-[#1e3a5f] px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition w-full md:w-auto"
        >
          + Add New Product
        </button>
      </div>

      {/* STATS */}
    <AdminStats />

      {/* TABLE */}
      <ProductTable
        products={products}
        onEdit={(p: Product) => {
          setEditing(p);
          setShowModal(true);
        }}
        refresh={loadData}
      />

      {/* ORDER PROCESSING */}
<OrdersTable />

      {/* MODAL (Only render ProductForm) */}
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
