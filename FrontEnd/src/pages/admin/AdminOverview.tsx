import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import AdminStats from "../../components/admin/AdminStats";
import { getProducts } from "../../services/AdminServices";
import { Product } from "../../components/product/types";

export default function AdminOverview() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const soldOut = products.filter((p) => p.stock <= 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="space-y-5">
      {(soldOut > 0 || lowStock > 0) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {soldOut > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700">
                <strong>{soldOut} product{soldOut > 1 ? "s" : ""}</strong> out of stock
              </span>
              <Link to="/admin/products"
                className="ml-auto flex items-center gap-1 text-xs text-red-600 hover:text-red-800">
                View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
          {lowStock > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-amber-700">
                <strong>{lowStock} product{lowStock > 1 ? "s" : ""}</strong> low stock (≤ 5)
              </span>
              <Link to="/admin/products"
                className="ml-auto flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800">
                View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      <AdminStats />
    </div>
  );
}
