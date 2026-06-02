import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ProductForm from "../../components/admin/ProductForm";
import ProductTable from "../../components/admin/ProductTable";
import { getProducts } from "../../services/AdminServices";
import { Product } from "../../components/product/types";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Products</h2>
          <p className="text-sm text-stone-400">{products.length} total in catalog</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="btn btn-primary text-sm py-2.5"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={(p: Product) => { setEditing(p); setShowModal(true); }}
        refresh={loadData}
      />

      {showModal && (
        <ProductForm
          fetchProducts={loadData}
          editingProduct={editing}
          setEditingProduct={setEditing}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
