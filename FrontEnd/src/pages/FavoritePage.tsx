import { useFavorites, FavoriteItem } from "../context/FavoriteContext";
import ProductCard from "../components/product/ProductCard";
import RestaurantCard from "../components/Eats/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-canvas pt-[150px] md:pt-[170px] pb-16 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-evergreen/40 transition"
            >
              <ArrowLeft className="w-4 h-4 text-evergreen" />
            </button>
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink flex items-center gap-2.5">
                <Heart className="w-7 h-7 text-clay fill-clay" />
                {t("my_favorites")}
              </h1>
              <p className="text-sm text-stone-400 mt-0.5">
                {favorites.length} saved item{favorites.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-clay/30 text-clay hover:bg-clay-soft transition text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              {t("clearAll")}
            </button>
          )}
        </div>

        {/* Empty */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center card">
            <div className="w-20 h-20 rounded-full bg-clay-soft flex items-center justify-center mb-6">
              <Heart className="w-9 h-9 text-clay/50" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-2">{t("favorite_msg")}</h3>
            <p className="text-stone-400 text-sm mb-7">
              Save products and restaurants to find them easily.
            </p>
            <button onClick={() => navigate("/products")} className="btn btn-primary">
              {t("explore_products")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {favorites.map((item) => {
              if (item.type === "product")
                return <ProductCard key={`p-${item.data._id}`} product={item.data} />;
              if (item.type === "restaurant")
                return (
                  <RestaurantCard
                    key={`r-${item.data.id}`}
                    restaurant={item.data}
                    onViewMenu={() => {}}
                  />
                );
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
