import { useFavorites, FavoriteItem } from "../context/FavoriteContext";
import ProductCard from "../components/product/ProductCard";
import RestaurantCard from "../components/Eats/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function FavoritePage() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Clear all favorites by toggling each one
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all favorites?")) {
      favorites.forEach((item: FavoriteItem) => {
        toggleFavorite(item); // remove each favorite
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1e3a5f]" />
            <h1 className="text-3xl font-bold text-[#1e3a5f]">
              ❤️ {t("my_favorites")}
            </h1>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-4 sm:mt-0 px-5 py-2 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition font-medium"
            >
              {t("clearAll")}
            </button>
          )}
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">
              {t("favorite_msg")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => {
              if (item.type === "product") {
                return (
                  <ProductCard
                    key={`product-${item.data._id}`}
                    product={item.data}
                  />
                );
              }

              if (item.type === "restaurant") {
                return (
                  <RestaurantCard
                    key={`restaurant-${item.data.id}`}
                    restaurant={item.data}
                    onViewMenu={() => {}}
                  />
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
