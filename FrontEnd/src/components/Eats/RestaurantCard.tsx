import { Star, MapPin, Clock, Phone, Award, Heart } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useFavorites } from "../../context/FavoriteContext";

export type Restaurant = {
  _id: string; // ✅ MUST match Mongo
  nameKey: string;
  cuisine: string;
  image: string;
  rating: number;
  reviews: number;
  locationKey: string;
  phone: string;
  openingHoursKey: string;
  priceRangeKey: string;
  description?: string;
  features?: string[];
  certified?: boolean;
};

type Props = {
  restaurant: Restaurant;
  onViewMenu: (id: string) => void;
};

export default function RestaurantCard({ restaurant, onViewMenu }: Props) {
  const { t } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorite = isFavorite(restaurant._id, "restaurant");

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition">
      <div className="relative h-56 overflow-hidden">
        <img
          src={restaurant.image}
          alt={t(restaurant.nameKey)}
          className="w-full h-full object-cover"
        />

        {restaurant.certified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <Award className="w-4 h-4" />
            <span>{t("certified")}</span>
          </div>
        )}

        <button
          onClick={() =>
            toggleFavorite({ type: "restaurant", data: restaurant })
          }
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
        >
          <Heart
            className={`w-5 h-5 ${
              favorite ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between mb-2">
          <h3 className="text-xl font-bold">
            {t(restaurant.nameKey)}
          </h3>
          <span className="bg-yellow-300 px-2 py-1 text-sm rounded">
            {t(restaurant.cuisine)}
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span>{restaurant.rating}</span>
          <span className="text-sm text-gray-500">
            ({restaurant.reviews})
          </span>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{t(restaurant.locationKey)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{t(restaurant.openingHoursKey)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>{restaurant.phone}</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="font-bold">
            {t("Rs")} {t(restaurant.priceRangeKey)}
          </div>

          <button
            className="bg-blue-900 text-white px-5 py-2 rounded"
            onClick={() => onViewMenu(restaurant._id)} // ✅ FIXED
          >
            {t("view_menu")}
          </button>
        </div>
      </div>
    </div>
  );
}
