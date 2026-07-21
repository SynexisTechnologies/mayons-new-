import { useEffect, useState } from "react";
import { productService } from "../../services/ProductServices";
import { Product } from "../product/types";
import { getAllcat, getSubcatByCategory, getSubCategory1BySubCategory, SubCategory, SubCategory1 } from "../../services/CategoryServices";
import { Category } from "../../types/Category";
import { imageUrl } from "../../utils/imageUrl";

type Props = {
  fetchProducts: () => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  onClose: () => void;
};

const F = "w-full border border-gray-200 px-3 py-2.5 rounded-xl outline-none transition focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] bg-white text-sm";
const L = "block text-sm font-semibold mb-1.5 text-gray-700";

export default function ProductForm({ fetchProducts, editingProduct, setEditingProduct, onClose }: Props) {
  const initial: Partial<Product> = {
    pluNumber: "", nameEn: "", nameSi: "", category: "", subCategory: "", subCategory1: "",
    image: "", descriptionEn: "", descriptionSi: "", unit: "",
    cost: 0, oldPrice: 0, newPrice: 0, discount: 0, sizes: [], colors: [],
    isActive: true, isSoldOut: false, stock: 0,
  };

  const [form, setForm] = useState<Partial<Product>>(initial);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<SubCategory[]>([]);
  const [filteredSubs1, setFilteredSubs1] = useState<SubCategory1[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Selected file (the actual upload) + a local preview URL
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    getAllcat()
      .then(setDbCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (editingProduct) setForm(editingProduct);
  }, [editingProduct]);

  // Build/revoke the object URL for the chosen file
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image must be 5 MB or smaller.");
      return;
    }
    setFormError("");
    setImageFile(file);
  };

  // What to show in the preview: new file > existing saved image > nothing
  const previewSrc = imagePreview || (form.image ? imageUrl(form.image) : "");
  const hasImage = Boolean(imageFile) || Boolean(form.image);

  // Load subcategories when category changes
  useEffect(() => {
    const catObj = dbCategories.find((c) => c.name === form.category);
    if (catObj?._id) {
      getSubcatByCategory(catObj._id)
        .then(setFilteredSubs)
        .catch(() => setFilteredSubs([]));
    } else {
      setFilteredSubs([]);
    }
  }, [form.category, dbCategories]);

  // Load sub-subcategories (Sub category 1) when subCategory changes
  useEffect(() => {
    const subObj = filteredSubs.find((s) => s.name === form.subCategory);
    if (subObj?._id) {
      getSubCategory1BySubCategory(subObj._id)
        .then(setFilteredSubs1)
        .catch(() => setFilteredSubs1([]));
    } else {
      setFilteredSubs1([]);
    }
  }, [form.subCategory, filteredSubs]);

  // Auto-calculate discount
  useEffect(() => {
    const old = Number(form.oldPrice);
    const cur = Number(form.newPrice);
    if (old > 0 && cur > 0 && cur < old) {
      setForm((p) => ({ ...p, discount: Math.round(((old - cur) / old) * 100) }));
    } else {
      setForm((p) => ({ ...p, discount: 0 }));
    }
  }, [form.oldPrice, form.newPrice]);

  const selectedCat = dbCategories.find((c) => c.name === form.category);
  const isClothing =
    selectedCat?.titleKey?.toLowerCase().includes("cloth") ||
    selectedCat?.name?.toLowerCase().includes("cloth") ||
    false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (
      !form.pluNumber?.trim() ||
      !form.nameEn?.trim() ||
      !form.nameSi?.trim() ||
      !form.category ||
      !form.descriptionEn?.trim() ||
      !form.descriptionSi?.trim() ||
      !hasImage
    ) {
      setFormError("Please fill all required fields (marked with *), including a product image.");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("pluNumber", form.pluNumber);
      fd.append("nameEn", form.nameEn);
      fd.append("nameSi", form.nameSi);
      fd.append("category", form.category);
      if (form.subCategory) fd.append("subCategory", form.subCategory);
      if (form.subCategory1) fd.append("subCategory1", form.subCategory1);
      fd.append("descriptionEn", form.descriptionEn);
      fd.append("descriptionSi", form.descriptionSi);
      if (form.unit) fd.append("unit", form.unit);
      fd.append("cost", String(Number(form.cost) || 0));
      fd.append("oldPrice", String(Number(form.oldPrice) || 0));
      fd.append("newPrice", String(Number(form.newPrice) || 0));
      fd.append("stock", String(Number(form.stock) || 0));
      fd.append("sizes", JSON.stringify(isClothing ? form.sizes || [] : []));
      fd.append("colors", JSON.stringify(isClothing ? form.colors || [] : []));
      fd.append("isActive", String(form.isActive ?? true));
      fd.append("isSoldOut", String(form.isSoldOut ?? false));

      // New file → upload it; otherwise keep the existing image filename (edit case)
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (form.image) {
        fd.append("image", form.image);
      }

      if (editingProduct) {
        await productService.update(editingProduct._id!, fd);
        setEditingProduct(null);
      } else {
        await productService.create(fd);
        setFormSuccess("Product created successfully!");
      }

      setForm(initial);
      setImageFile(null);
      fetchProducts();
      setTimeout(onClose, 700);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(initial);
    setImageFile(null);
    setEditingProduct(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a7c] text-white rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">Fields marked with * are required</p>
          </div>
          <button onClick={handleCancel} className="text-white text-2xl hover:text-[#d4af37] transition leading-none">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-7">

          {/* BASIC INFO */}
          <section className="bg-gray-50 p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-[#1e3a5f] border-b border-gray-200 pb-2">Basic Information</h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={L}>PLU Number *</label>
                <input type="text" value={form.pluNumber || ""} onChange={(e) => setForm({ ...form, pluNumber: e.target.value })}
                  className={F} placeholder="e.g. PLU-001" />
              </div>

              <div className="md:col-span-2">
                <label className={L}>Product Image *</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 shrink-0 rounded-xl border border-gray-200 bg-white overflow-hidden flex items-center justify-center text-gray-300 text-xs">
                    {previewSrc ? (
                      <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      "No image"
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#1e3a5f] cursor-pointer text-sm font-semibold text-gray-700 transition">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      {hasImage ? "Change image" : "Upload image"}
                    </label>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {imageFile ? imageFile.name : "JPG, PNG, WEBP or GIF — up to 5 MB"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className={L}>Product Name (English) *</label>
                <input type="text" value={form.nameEn || ""} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className={F} />
              </div>

              <div>
                <label className={L}>Product Name (Sinhala) *</label>
                <input type="text" value={form.nameSi || ""} onChange={(e) => setForm({ ...form, nameSi: e.target.value })}
                  className={F} />
              </div>

              <div>
                <label className={L}>Category *</label>
                <select value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: "" })}
                  className={F}>
                  <option value="">Select Category</option>
                  {dbCategories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={L}>Sub Category</label>
                <select value={form.subCategory || ""} onChange={(e) => setForm({ ...form, subCategory: e.target.value, subCategory1: "" })}
                  className={`${F} disabled:bg-gray-100 disabled:text-gray-400`}
                  disabled={!form.category || filteredSubs.length === 0}>
                  <option value="">
                    {!form.category ? "Select a category first" : filteredSubs.length === 0 ? "No sub-categories" : "Select Sub Category"}
                  </option>
                  {filteredSubs.map((sub) => (
                    <option key={sub._id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={L}>Sub Category 1</label>
                <select value={form.subCategory1 || ""} onChange={(e) => setForm({ ...form, subCategory1: e.target.value })}
                  className={`${F} disabled:bg-gray-100 disabled:text-gray-400`}
                  disabled={!form.subCategory || filteredSubs1.length === 0}>
                  <option value="">
                    {!form.subCategory ? "Select a sub category first" : filteredSubs1.length === 0 ? "No sub-categories" : "Select Sub Category 1"}
                  </option>
                  {filteredSubs1.map((sub) => (
                    <option key={sub._id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={L}>Unit</label>
                <input type="text" value={form.unit || ""} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className={F} placeholder="e.g. kg, pcs, litre" />
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="bg-gray-50 p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-[#1e3a5f] border-b border-gray-200 pb-2">Description</h3>

            <div>
              <label className={L}>Description (English) *</label>
              <textarea value={form.descriptionEn || ""} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className={`${F} h-24 resize-none`} />
            </div>

            <div>
              <label className={L}>Description (Sinhala) *</label>
              <textarea value={form.descriptionSi || ""} onChange={(e) => setForm({ ...form, descriptionSi: e.target.value })}
                className={`${F} h-24 resize-none`} />
            </div>
          </section>

          {/* PRICING */}
          <section className="bg-gray-50 p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-[#1e3a5f] border-b border-gray-200 pb-2">Pricing & Inventory</h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              <div>
                <label className={L}>Cost (Rs)</label>
                <input type="number" value={form.cost || ""} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                  className={F} min="0" placeholder="0" />
              </div>

              <div>
                <label className={L}>MRP Price (Rs) *</label>
                <input type="number" value={form.oldPrice || ""} onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })}
                  className={F} min="0" placeholder="0" />
              </div>

              <div>
                <label className={L}>Our Price (Rs) *</label>
                <input type="number" value={form.newPrice || ""} onChange={(e) => setForm({ ...form, newPrice: Number(e.target.value) })}
                  className={F} min="0" placeholder="0" />
              </div>

              <div>
                <label className={L}>Discount (%)</label>
                <input type="number" value={form.discount || 0} readOnly
                  className={`${F} bg-gray-100 cursor-not-allowed`} />
              </div>

              <div>
                <label className={L}>Stock *</label>
                <input type="number" value={form.stock ?? 0} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className={F} min="0" />
              </div>
            </div>
          </section>

          {/* VARIANTS — clothing only */}
          {isClothing && (
            <section className="bg-gray-50 p-6 rounded-2xl space-y-5">
              <h3 className="text-base font-bold text-[#1e3a5f] border-b border-gray-200 pb-2">Variants</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={L}>Sizes (comma separated)</label>
                  <input type="text" value={form.sizes?.join(", ") || ""}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    className={F} placeholder="S, M, L, XL" />
                </div>

                <div>
                  <label className={L}>Colors (comma separated)</label>
                  <input type="text" value={form.colors?.join(", ") || ""}
                    onChange={(e) => setForm({ ...form, colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })}
                    className={F} placeholder="Red, Blue, Green" />
                </div>
              </div>
            </section>
          )}

          {/* STATUS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 bg-gray-50 px-5 py-4 rounded-2xl flex-1">
              <input type="checkbox" id="isActive" checked={form.isActive ?? true}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 accent-[#1e3a5f]" />
              <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 select-none">
                Product Active — visible to customers
              </label>
            </div>

            <div className="flex items-center gap-3 bg-red-50 px-5 py-4 rounded-2xl flex-1">
              <input type="checkbox" id="isSoldOut" checked={form.isSoldOut ?? false}
                onChange={(e) => setForm({ ...form, isSoldOut: e.target.checked })}
                className="w-5 h-5 accent-red-600" />
              <label htmlFor="isSoldOut" className="text-sm font-semibold text-red-700 select-none">
                Mark as Sold Out
              </label>
            </div>
          </div>

          {/* FEEDBACK */}
          {formError && (
            <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200">{formError}</p>
          )}
          {formSuccess && (
            <p className="text-green-600 text-sm bg-green-50 px-4 py-3 rounded-xl border border-green-200">{formSuccess}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-[#1e3a5f] text-white hover:bg-[#2a4a7c] font-medium transition shadow-md disabled:opacity-60">
              {submitting ? "Saving…" : editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
