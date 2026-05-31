import { deleteProduct } from "../../services/AdminServices";
import { Product } from "../product/types";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductTable({ products, onEdit, refresh }: any) {
    const { language, setLanguage, t } = useLanguage();
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg overflow-auto mt-8">
      <table className="min-w-full text-sm">
        <thead className="bg-[#1e3a5f] text-[#d4af37]">
          <tr>
            <th className="p-3 text-left">Image</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((p: Product) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <img src={p.image} className="w-12 h-12 object-cover rounded" />
              </td>

              <td>{p.nameEn}</td>
       
              <td>{p.category}</td>
              <td>
  {t("Rs")}{" "}
  {p.discount && p.discount > 0
    ? p.newPrice
    : p.price}
</td>
              {/* Quantity sold (aggregate) stored in product.sold */}
              <td className="text-center">{p.sold || 0}</td>
 <td>
  {p.stock > 0 ? (
    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
      {t("inStock")} ({p.stock})
    </span>
  ) : (
    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
      {t("outOfStock")}
    </span>
  )}
</td>
              <td className="flex gap-3 justify-center">
                <button
                  onClick={() => onEdit(p)}
                  className="text-[#2a4a7c] hover:text-[#d4af37]"
                >
                 {t("edit")} 
                </button>

                <button
                  onClick={async () => {
                    await deleteProduct(p._id);
                    refresh();
                  }}
                  className="text-red-600"
                >
                  {t("delete")}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
