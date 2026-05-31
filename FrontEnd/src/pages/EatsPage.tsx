import { useEffect, useState } from "react";
import { fetchRestaurants, fetchMenu } from "../api/EatsApi";
import RestaurantCard from "../components/Eats/RestaurantCard";
import MenuModal from "../components/Eats/MenuModel";
import { useLanguage } from "../context/LanguageContext";
import { UtensilsCrossed, ChevronRight } from "lucide-react";

const CUISINES = ["all", "international", "cafe", "sri_lankan", "healthy_bowl", "vegan", "farm_to_table"];

export default function EatsPage() {
  const { t } = useLanguage();
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [restaurantMenus, setRestaurantMenus] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  const filteredRestaurants =
    selectedCuisine === "all" ? restaurants : restaurants.filter((r) => r.cuisine === selectedCuisine);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchRestaurants();
        setRestaurants(res?.data || res || []);
      } catch { setRestaurants([]); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <main className="bg-slate-50 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Food"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-transparent" />
        </div>
        <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-white text-center px-4 pt-[80px] md:pt-[130px] pb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 px-4 py-1.5 rounded-full mb-4">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[#d4af37] text-xs font-bold tracking-widest uppercase">Mayan's Eats</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight drop-shadow">
            {t("eats_title")}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mb-8">
            {t("discover_text")}
          </p>
          <button
            onClick={() => document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 bg-[#d4af37] text-[#1e3a5f] rounded-full font-bold hover:bg-[#e0c040] transition shadow-lg cursor-pointer text-sm"
          >
            {t("explore_text")}
          </button>
        </div>
      </section>

      {/* ── FILTERS + RESTAURANTS ── */}
      <section id="restaurants" className="max-w-7xl mx-auto px-4 py-12">

        {/* Cuisine filter pills */}
        <div className="relative mb-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pr-8">
            {CUISINES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedCuisine === c
                    ? "bg-[#1e3a5f] text-[#d4af37] shadow-md"
                    : "bg-white text-[#1e3a5f]/70 border border-slate-200 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f]"
                }`}
              >
                {t(c)}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none flex items-center justify-end pr-1">
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm text-slate-400 mb-6">
            <span className="font-bold text-[#1e3a5f]">{filteredRestaurants.length}</span> restaurant{filteredRestaurants.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="h-56 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-9 bg-slate-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No restaurants found for this cuisine.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((r) => (
              <RestaurantCard
                key={r._id || r.id}
                restaurant={{ ...r, id: r._id || r.id }}
                onViewMenu={async (id: string) => {
                  setSelectedRestaurant(id);
                  if (!restaurantMenus[id]) {
                    const menuRes = await fetchMenu(id);
                    setRestaurantMenus((prev) => ({ ...prev, [id]: menuRes?.data || menuRes || [] }));
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>

      {selectedRestaurant !== null && restaurantMenus[selectedRestaurant] && (
        <MenuModal
          restaurantName={restaurants.find((r) => (r._id || r.id) === selectedRestaurant)?.nameKey || ""}
          categories={restaurantMenus[selectedRestaurant]}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </main>
  );
}
