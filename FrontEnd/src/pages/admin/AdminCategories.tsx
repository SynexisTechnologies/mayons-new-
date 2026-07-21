import { useEffect, useState } from "react";
import { Plus, Trash2, Percent, ChevronRight } from "lucide-react";
import {
  getAllcat,
  createCategory,
  deleteCategory,
  applyCategoryDiscount,
  getSubcatByCategory,
  createSubCategory,
  deleteSubCategory,
  getSubCategory1BySubCategory,
  createSubCategory1,
  deleteSubCategory1,
  SubCategory,
  SubCategory1,
} from "../../services/CategoryServices";
import { Category } from "../../types/Category";

const toTitleKey = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "");

const F = "w-full border border-gray-200 px-3 py-2 rounded-lg outline-none transition focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] bg-white text-sm";

const getErrMsg = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const resp = (err as { response?: { data?: { message?: string } } }).response;
    if (resp?.data?.message) return resp.data.message;
  }
  return fallback;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null);
  const [subCategories1, setSubCategories1] = useState<SubCategory1[]>([]);

  const [newCatName, setNewCatName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSub1Name, setNewSub1Name] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = () => getAllcat().then(setCategories).catch(console.error);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!selectedCat) {
      setSubCategories([]);
      setSelectedSub(null);
      return;
    }
    setDiscountPct(String(selectedCat.discount ?? 0));
    getSubcatByCategory(selectedCat._id).then(setSubCategories).catch(console.error);
    setSelectedSub(null);
  }, [selectedCat]);

  useEffect(() => {
    if (!selectedSub) {
      setSubCategories1([]);
      return;
    }
    getSubCategory1BySubCategory(selectedSub._id).then(setSubCategories1).catch(console.error);
  }, [selectedSub]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setError("");
    setBusy(true);
    try {
      await createCategory({ titleKey: toTitleKey(newCatName), name: newCatName.trim() });
      setNewCatName("");
      loadCategories();
    } catch (err) {
      setError(getErrMsg(err, "Failed to add category"));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Its sub-categories will remain orphaned.")) return;
    await deleteCategory(id);
    if (selectedCat?._id === id) setSelectedCat(null);
    loadCategories();
  };

  const handleApplyDiscount = async () => {
    if (!selectedCat) return;
    const pct = Number(discountPct);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      setError("Discount must be a number between 0 and 100");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const updated = await applyCategoryDiscount(selectedCat._id, pct);
      setSelectedCat(updated);
      loadCategories();
    } catch (err) {
      setError(getErrMsg(err, "Failed to apply discount"));
    } finally {
      setBusy(false);
    }
  };

  const handleAddSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat || !newSubName.trim()) return;
    setError("");
    setBusy(true);
    try {
      await createSubCategory({ titleKey: toTitleKey(newSubName), name: newSubName.trim(), category: selectedCat._id });
      setNewSubName("");
      getSubcatByCategory(selectedCat._id).then(setSubCategories);
    } catch (err) {
      setError(getErrMsg(err, "Failed to add sub category"));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteSub = async (id: string) => {
    if (!confirm("Delete this sub category?")) return;
    await deleteSubCategory(id);
    if (selectedSub?._id === id) setSelectedSub(null);
    if (selectedCat) getSubcatByCategory(selectedCat._id).then(setSubCategories);
  };

  const handleAddSub1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !newSub1Name.trim()) return;
    setError("");
    setBusy(true);
    try {
      await createSubCategory1({ titleKey: toTitleKey(newSub1Name), name: newSub1Name.trim(), subCategory: selectedSub._id });
      setNewSub1Name("");
      getSubCategory1BySubCategory(selectedSub._id).then(setSubCategories1);
    } catch (err) {
      setError(getErrMsg(err, "Failed to add sub category 1"));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteSub1 = async (id: string) => {
    if (!confirm("Delete this sub category 1?")) return;
    await deleteSubCategory1(id);
    if (selectedSub) getSubCategory1BySubCategory(selectedSub._id).then(setSubCategories1);
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-ink">Categories</h2>
        <p className="text-sm text-stone-400">
          Manage Category → Sub Category → Sub Category 1, and apply category-wide discounts
        </p>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200 mb-4">{error}</p>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* CATEGORIES */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-[#1e3a5f] mb-3">Categories</h3>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="New category name" className={F} />
            <button type="submit" disabled={busy} className="shrink-0 w-9 h-9 rounded-lg bg-[#1e3a5f] text-white flex items-center justify-center hover:bg-[#2a4a7c] transition disabled:opacity-60">
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCat(cat)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                  selectedCat?._id === cat._id ? "bg-[#1e3a5f] text-white" : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  {cat.name}
                  {!!cat.discount && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${selectedCat?._id === cat._id ? "bg-white/20" : "bg-[#d4af37]/15 text-[#1e3a5f]"}`}>
                      -{cat.discount}%
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <Trash2
                    className="w-3.5 h-3.5 opacity-60 hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id); }}
                  />
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </span>
              </button>
            ))}
            {categories.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No categories yet.</p>}
          </div>
        </div>

        {/* SUB CATEGORIES */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-[#1e3a5f] mb-3">
            Sub Categories {selectedCat && <span className="text-slate-400 font-normal">— {selectedCat.name}</span>}
          </h3>

          {selectedCat && (
            <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center gap-2">
              <Percent className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="number" min={0} max={100} value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
                className={`${F} w-20`}
              />
              <button onClick={handleApplyDiscount} disabled={busy} className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#d4af37] text-[#1e3a5f] hover:bg-[#c19d2e] transition disabled:opacity-60 whitespace-nowrap">
                Apply to all products
              </button>
            </div>
          )}

          {!selectedCat ? (
            <p className="text-sm text-slate-400 text-center py-6">Select a category first.</p>
          ) : (
            <>
              <form onSubmit={handleAddSub} className="flex gap-2 mb-4">
                <input value={newSubName} onChange={(e) => setNewSubName(e.target.value)} placeholder="New sub category name" className={F} />
                <button type="submit" disabled={busy} className="shrink-0 w-9 h-9 rounded-lg bg-[#1e3a5f] text-white flex items-center justify-center hover:bg-[#2a4a7c] transition disabled:opacity-60">
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
                {subCategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => setSelectedSub(sub)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                      selectedSub?._id === sub._id ? "bg-[#1e3a5f] text-white" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Trash2
                        className="w-3.5 h-3.5 opacity-60 hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); handleDeleteSub(sub._id); }}
                      />
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </span>
                  </button>
                ))}
                {subCategories.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No sub categories yet.</p>}
              </div>
            </>
          )}
        </div>

        {/* SUB CATEGORY 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-[#1e3a5f] mb-3">
            Sub Category 1 {selectedSub && <span className="text-slate-400 font-normal">— {selectedSub.name}</span>}
          </h3>

          {!selectedSub ? (
            <p className="text-sm text-slate-400 text-center py-6">Select a sub category first.</p>
          ) : (
            <>
              <form onSubmit={handleAddSub1} className="flex gap-2 mb-4">
                <input value={newSub1Name} onChange={(e) => setNewSub1Name(e.target.value)} placeholder="New sub category 1 name" className={F} />
                <button type="submit" disabled={busy} className="shrink-0 w-9 h-9 rounded-lg bg-[#1e3a5f] text-white flex items-center justify-center hover:bg-[#2a4a7c] transition disabled:opacity-60">
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
                {subCategories1.map((sub1) => (
                  <div key={sub1._id} className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <span className="truncate">{sub1.name}</span>
                    <Trash2 className="w-3.5 h-3.5 opacity-60 hover:opacity-100 cursor-pointer" onClick={() => handleDeleteSub1(sub1._id)} />
                  </div>
                ))}
                {subCategories1.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No sub category 1 items yet.</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
