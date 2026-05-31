import { useFavorites, FavoriteItem } from "../context/FavoriteContext";
import ProductCard from "../components/product/ProductCard";
import RestaurantCard from "../components/Eats/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function FavoritePage() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClearAll = () => {
    if (confirm("Clear all favorites?")) {
      [...favorites].forEach((item: FavoriteItem) => toggleFavorite(item));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#1e3a5f]/40 transition">
              <ArrowLeft className="w-4 h-4 text-[#1e3a5f]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                {t("my_favorites")}
              </h1>
              <p className="text-sm text-slate-400">{favorites.length} saved item{favorites.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium">
              <Trash2 className="w-4 h-4" />
              {t("clearAll")}
            </button>
          )}
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-5">
              <Heart className="w-9 h-9 text-rose-300" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{t("favorite_msg")}</h3>
            <p className="text-slate-400 text-sm mb-6">Save products and restaurants to find them easily.</p>
            <button onClick={() => navigate("/products")}
              className="px-7 py-2.5 bg-[#1e3a5f] text-white rounded-full text-sm font-semibold hover:bg-[#2a4a7c] transition shadow-sm">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {favorites.map((item) => {
              if (item.type === "product") return <ProductCard key={`p-${item.data._id}`} product={item.data} />;
              if (item.type === "restaurant") return <RestaurantCard key={`r-${item.data.id}`} restaurant={item.data} onViewMenu={() => {}} />;
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
