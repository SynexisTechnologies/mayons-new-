import { useEffect, useState } from "react";
import { productService } from "../../services/ProductServices";
import { Product } from "../product/types";
import { megaCategories } from "../../data/categories";
import { useLanguage } from "../../context/LanguageContext";
import { getAllcat, getSubAllcat } from "../../services/CategoryServices";



type Props = {
  fetchProducts: () => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  onClose: () => void;
};

export default function ProductForm({
  fetchProducts,
  editingProduct,
  setEditingProduct,
  onClose,
}: Props) {
  const initialState: Partial<Product> = {
    pluNumber: "",
    nameEn: "",
    nameSi: "",
    category: "",
    subCategory: "",
    image: "",
    descriptionEn: "",
    descriptionSi: "",
    oldPrice: 0,
    newPrice: 0,
    discount: 0,
    sizes: [],
    colors: [],
    isActive: true,
    stock: 0,
  };

  const [form, setForm] = useState<Partial<Product>>(initialState);
  const [categories, setCategories] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");


useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getAllcat(); 
      console.log("daa",data)
      setCategories(data.map((c: any) => c.name));
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  // Auto Discount Calculation
  useEffect(() => {
    if (form.oldPrice && form.newPrice && form.newPrice < form.oldPrice) {
      const discount = Math.round(
        ((form.oldPrice - form.newPrice) / form.oldPrice) * 100
      );
      setForm((prev) => ({ ...prev, discount }));
    } else {
      setForm((prev) => ({ ...prev, discount: 0 }));
    }
  }, [form.oldPrice, form.newPrice]);

  // Clear sizes & colors if not Clothing
  useEffect(() => {
    if (form.category !== "Clothing & Apparel") {
      setForm((prev) => ({
        ...prev,
        sizes: [],
        colors: [],
      }));
    }
  }, [form.category]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload: Partial<Product> = {
      pluNumber: form.pluNumber,
      nameEn: form.nameEn,
      nameSi: form.nameSi,
      descriptionEn: form.descriptionEn,
      descriptionSi: form.descriptionSi,
      category: form.category,
      subCategory: form.subCategory,
      image: form.image,
      unit: form.unit, // ✅ send unit
      oldPrice: Number(form.oldPrice) || 0,
      newPrice: Number(form.newPrice) || 0,
      stock: Number(form.stock) || 0, // ✅ send stock
      discount: form.discount ?? 0,
      sizes: form.sizes || [],
      colors: form.colors || [],
      isActive: form.isActive ?? true,
    };

    if (!payload.pluNumber || !payload.nameEn || !payload.category || payload.oldPrice === undefined || payload.newPrice === undefined) {
      setFormError("Please fill all required fields.");
      return;
    }

    setFormError("");
    if (editingProduct) {
      await productService.update(editingProduct._id!, payload);
      setEditingProduct(null);
    } else {
      await productService.create(payload);
      setFormSuccess("Product created successfully!");
    }

    setForm(initialState);
    fetchProducts();
    setTimeout(onClose, 600);
  } catch (err: any) {
    console.error("Failed to save product:", err);
    setFormError(err.response?.data?.message || "Failed to save product");
  }
 };


  const handleCancel = () => {
    setForm(initialState);
    setEditingProduct(null);
    onClose();
  };

  const showVariants = form.category === "Clothing & Apparel";
  const { t } = useLanguage();

  const filteredSubCategories = (megaCategories.find(
    (cat) => t(cat.titleKey) === form.category
  )?.items || []).map((it: any) => (typeof it === "string" ? it : it.titleKey));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b bg-gradient-to-r from-[#1e3a5f] to-[#2a4a7c] text-white rounded-t-3xl">
          <h2 className="text-xl font-semibold tracking-wide">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={handleCancel}
            className="text-white text-2xl hover:text-[#d4af37] transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8">

          {/* BASIC INFO */}
          <section className="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-[#1e3a5f]">
              Basic Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="label">PLU Number *</label>
                <input
                  type="text"
                  value={form.pluNumber}
                  onChange={(e) =>
                    setForm({ ...form, pluNumber: e.target.value })
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">Product Name (English) *</label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) =>
                    setForm({ ...form, nameEn: e.target.value })
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">Product Name (Sinhala)</label>
                <input
                  type="text"
                  value={form.nameSi}
                  onChange={(e) =>
                    setForm({ ...form, nameSi: e.target.value })
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">Category *</label>
                 <select
  value={form.category}
  onChange={(e) =>
    setForm({ ...form, category: e.target.value, subCategory: "" })
  }
  className="input"
>
  <option value="">Select Category</option>
  {megaCategories.map((cat) => (
    <option key={cat.titleKey} value={t(cat.titleKey)}>
      {t(cat.titleKey)}
    </option>
  ))}
</select>

              </div>
            </div>

            <div>
              <label className="label">Sub Category</label>
  <select
  value={form.subCategory}
  onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
  className="input"
  disabled={!form.category}
>
  <option value="">Select Sub Category</option>
  {filteredSubCategories.map((subKey) => (
    <option key={subKey} value={subKey}>
      {t(subKey)}
    </option>
  ))}
</select>
            </div>

            <div>
              <label className="label">Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                className="input"
              />
            </div>
            <div>
  <label className="label">Unit</label>
  <input
    type="text"
    value={form.unit || ""}
    onChange={(e) => setForm({ ...form, unit: e.target.value })}
    className="input"
  />
</div>
          </section>

          {/* DESCRIPTION */}
          <section className="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-[#1e3a5f]">
              Description
            </h3>

            <div>
              <label className="label">Description (English)</label>
              <textarea
                value={form.descriptionEn}
                onChange={(e) =>
                  setForm({ ...form, descriptionEn: e.target.value })
                }
                className="input h-24"
              />
            </div>

            <div>
              <label className="label">Description (Sinhala)</label>
              <textarea
                value={form.descriptionSi}
                onChange={(e) =>
                  setForm({ ...form, descriptionSi: e.target.value })
                }
                className="input h-24"
              />
            </div>
          </section>

          {/* PRICING */}
          <section className="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-[#1e3a5f]">
              Pricing
            </h3>

            <div className="grid md:grid-cols-3 gap-6">

              <div>
                <label className="label">Old Price *</label>
                <input
                  type="text"
                  value={form.oldPrice}
                  onChange={(e) =>
                    setForm({ ...form, oldPrice: Number(e.target.value) })
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">New Price *</label>
                <input
                  type="text"
                  value={form.newPrice}
                  onChange={(e) =>
                    setForm({ ...form, newPrice: Number(e.target.value) })
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">Discount (%)</label>
                <input
                  type="number"
                  value={form.discount}
                  readOnly
                  className="input bg-gray-200 cursor-not-allowed"
                />
              </div>
              <div>
  <label className="label">Stock Quantity *</label>
  <input
    type="number"
    value={form.stock}
    onChange={(e) =>
      setForm({ ...form, stock: Number(e.target.value) })
    }
    className="input"
    min="0"
  />
</div>

            </div>
          </section>

          {/* VARIANTS */}
          {showVariants && (
            <section className="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-[#1e3a5f]">
                Variants
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={form.sizes?.join(",")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sizes: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={form.colors?.join(",")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        colors: e.target.value.split(",").map((c) => c.trim()),
                      })
                    }
                    className="input"
                  />
                </div>
              </div>
            </section>
          )}

          {/* STATUS */}
          <div className="flex items-center justify-between">
            <label className="label mb-0">Product Active</label>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
              className="w-5 h-5 accent-[#1e3a5f]"
            />
          </div>

          {/* FOOTER */}
          {formError && <p className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-sm bg-green-50 px-4 py-2.5 rounded-xl border border-green-100">{formSuccess}</p>}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#1e3a5f] text-white hover:bg-[#2a4a7c] transition shadow-md"
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          .label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 6px;
            color: #374151;
          }

          .input {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            border-radius: 0.75rem;
            width: 100%;
            outline: none;
            transition: 0.2s;
          }

          .input:focus {
            border-color: #1e3a5f;
            box-shadow: 0 0 0 1px #1e3a5f;
          }
        `}
      </style>
    </div>
  );
}