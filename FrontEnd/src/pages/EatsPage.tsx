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
    selectedCuisine === "all"
      ? restaurants
      : restaurants.filter((r) => r.cuisine === selectedCuisine);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchRestaurants();
        setRestaurants(res?.data || res || []);
      } catch {
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="bg-canvas min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Food"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="relative z-10 min-h-[480px] md:min-h-[560px] max-w-7xl mx-auto flex flex-col justify-center text-white px-6 pt-[120px] md:pt-[150px] pb-14">
          <p className="eyebrow text-honey-light mb-4">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Mayan&apos;s Eats
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tight max-w-2xl leading-[1.02]">
            {t("eats_title")}
          </h1>
          <p className="text-white/70 text-base max-w-2xl mb-8">{t("discover_text")}</p>
          <button
            onClick={() =>
              document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn btn-accent self-start"
          >
            {t("explore_text")}
          </button>
        </div>
      </section>

      {/* FILTERS + RESTAURANTS */}
      <section id="restaurants" className="max-w-7xl mx-auto px-6 py-14">
        <div className="relative mb-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pr-8">
            {CUISINES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                  selectedCuisine === c
                    ? "bg-evergreen text-white shadow-sm"
                    : "bg-white text-stone-500 border border-stone-200 hover:border-evergreen/40 hover:text-evergreen"
                }`}
              >
                {t(c)}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-canvas to-transparent pointer-events-none flex items-center justify-end pr-1">
            <ChevronRight className="w-4 h-4 text-stone-300" />
          </div>
        </div>

        {!loading && (
          <p className="text-sm text-stone-400 mb-6">
            <span className="font-display font-bold text-evergreen text-lg">
              {filteredRestaurants.length}
            </span>{" "}
            restaurant{filteredRestaurants.length !== 1 ? "s" : ""}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-56 skeleton" />
                <div className="p-6 space-y-3">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-9 skeleton rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
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
          restaurantName={
            restaurants.find((r) => (r._id || r.id) === selectedRestaurant)?.nameKey || ""
          }
          categories={restaurantMenus[selectedRestaurant]}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </main>
  );
}
