import { deleteProduct } from "../../services/AdminServices";
import { Product } from "../product/types";
import { useLanguage } from "../../context/LanguageContext";
import { Pencil, Trash2 } from "lucide-react";
import { imageUrl } from "../../utils/imageUrl";

export default function ProductTable({ products, onEdit, refresh }: any) {
  const { t } = useLanguage();

  if (!products.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-8 p-12 text-center text-slate-400">
        No products yet. Add one above.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-[#1e3a5f]">Products <span className="text-slate-400 font-normal text-sm">({products.length})</span></h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Image", "Name", "Category", "Price", "Sold", "Stock", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((p: Product) => (
              <tr key={p._id} className="hover:bg-slate-50/60 transition">
                <td className="px-5 py-3">
                  <img src={imageUrl(p.image)} alt={p.nameEn} className="w-11 h-11 object-cover rounded-xl border border-slate-100" />
                </td>
                <td className="px-5 py-3 font-semibold text-[#1e3a5f] max-w-[180px] truncate">{p.nameEn}</td>
                <td className="px-5 py-3 text-slate-500">{p.category}</td>
                <td className="px-5 py-3 font-semibold text-[#1e3a5f]">
                  {t("Rs")} {p.discount && p.discount > 0 ? p.newPrice : p.price}
                  {p.discount && p.discount > 0 && (
                    <span className="ml-2 text-[10px] font-bold bg-[#d4af37]/15 text-[#1e3a5f] px-1.5 py-0.5 rounded-full">-{p.discount}%</span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-500 text-center">{p.sold || 0}</td>
                <td className="px-5 py-3">
                  {p.isSoldOut || p.stock <= 0 ? (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {p.isSoldOut ? "Sold Out" : "Out"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {p.stock}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => onEdit(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1e3a5f] border border-slate-200 hover:border-[#1e3a5f]/40 hover:bg-[#1e3a5f]/5 transition cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" /> {t("edit")}
                    </button>
                    <button onClick={async () => { if (confirm("Delete this product?")) { await deleteProduct(p._id); refresh(); } }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 transition cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> {t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
