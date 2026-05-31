import { Star, MapPin, Clock, Phone, Award, Heart, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useFavorites } from "../../context/FavoriteContext";

export type Restaurant = {
  _id: string;
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
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={restaurant.image}
          alt={t(restaurant.nameKey)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Certified badge */}
        {restaurant.certified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            <Award className="w-3 h-3" />
            {t("certified")}
          </div>
        )}

        {/* Cuisine tag */}
        <div className="absolute bottom-3 left-3 bg-[#d4af37] text-[#1e3a5f] text-[11px] font-bold px-2.5 py-1 rounded-full">
          {t(restaurant.cuisine)}
        </div>

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite({ type: "restaurant", data: restaurant })}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:scale-110 transition cursor-pointer"
        >
          <Heart className={`w-4 h-4 transition-colors ${favorite ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-[#1e3a5f] text-base leading-snug">{t(restaurant.nameKey)}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
            <span className="text-sm font-bold text-[#1e3a5f]">{restaurant.rating}</span>
            <span className="text-xs text-slate-400">({restaurant.reviews})</span>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#1e3a5f]/40 flex-shrink-0" />
            <span className="line-clamp-1">{t(restaurant.locationKey)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#1e3a5f]/40 flex-shrink-0" />
            <span>{t(restaurant.openingHoursKey)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#1e3a5f]/40 flex-shrink-0" />
            <span>{restaurant.phone}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm font-bold text-[#1e3a5f]">{t("Rs")} {t(restaurant.priceRangeKey)}</span>
          <button
            className="flex items-center gap-1.5 bg-[#1e3a5f] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#2a4a7c] transition shadow-sm cursor-pointer"
            onClick={() => onViewMenu(restaurant._id)}
          >
            {t("view_menu")} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
