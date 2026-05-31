import { useEffect, useState } from "react";
import { fetchRestaurants, fetchMenu } from "../api/EatsApi";
import RestaurantCard from "../components/Eats/RestaurantCard";
import MenuModal from "../components/Eats/MenuModel";
import { useLanguage } from "../context/LanguageContext";

export default function EatsPage() {
  const { t } = useLanguage();

  // 🔹 always lowercase
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [restaurantMenus, setRestaurantMenus] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  // ✅ Correct filtering logic
  const filteredRestaurants =
    selectedCuisine === "all"
      ? restaurants
      : restaurants.filter((r) => r.cuisine === selectedCuisine);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchRestaurants();
        // accept both { data: [...] } or direct array
        const data = res?.data || res;
        setRestaurants(data || []);
      } catch (e) {
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Food background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-white">
          <div className="max-w-2xl backdrop-blur-md bg-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_4px_12px_#1e3a5f4d]">

            <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
              {t("eats_title")}
            </h1>

            <p className="text-sm sm:text-lg opacity-90 mb-8">
              {t("discover_text")}
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("restaurants")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-[#d4af37] text-[#1e3a5f] px-8 py-4 rounded-full hover:bg-[#c5a235] transition shadow-[0_4px_12px_#1e3a5f4d]"
            >
              {t("explore_text")}
            </button>

          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section id="restaurants" className="max-w-7xl mx-auto px-4 py-12">

        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-10">
          {[
            "all",
            "international",
            "cafe",
            "sri_lankan",
            "healthy_bowl",
            "vegan",
            "farm_to_table",
          ].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition
                ${
                  selectedCuisine === c
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-white text-gray-700 shadow-[0_4px_12px_#1e3a5f4d] hover:bg-[#d4af37]/20"
                }`}
            >
              {t(c)}
            </button>
          ))}
        </div>

        {/* RESTAURANT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((r) => (
            <RestaurantCard
              key={r._id || r.id}
              restaurant={{ ...r, id: r._id || r.id }}
              onViewMenu={async (id: string) => {
                setSelectedRestaurant(id);
                if (!restaurantMenus[id]) {
                  const menuRes = await fetchMenu(id);
                  const menuData = menuRes?.data || menuRes;
                  setRestaurantMenus((prev) => ({ ...prev, [id]: menuData || [] }));
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* MENU MODAL */}
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
