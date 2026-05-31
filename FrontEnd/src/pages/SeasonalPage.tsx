import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OfferService } from "../services/OffersServices";
import OfferCard from "../components/hotOffers/OffersCard";
import { Offer } from "../data/offer";
import { ArrowRight, Leaf } from "lucide-react";

export default function SeasonalPage() {
  const navigate = useNavigate();
  const [seasonalOffers, setSeasonalOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    OfferService.getAll()
      .then((data) => setSeasonalOffers(data.filter((o: Offer) => o.type === "SEASONAL")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#1e3a5f] py-20 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#d4af37] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-4">
            <Leaf className="w-3.5 h-3.5" />
            Limited Harvest
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Seasonal Collection
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            Fresh seasonal products specially selected for this time of the year — limited availability, exclusive deals.
          </p>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-white/10" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/10 rounded-full w-3/4" />
                  <div className="h-3 bg-white/10 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : seasonalOffers.length === 0 ? (
          <div className="text-center py-16">
            <Leaf className="w-14 h-14 mx-auto text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No seasonal products right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {seasonalOffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/offers?type=SEASONAL")}
            className="inline-flex items-center gap-2 bg-[#d4af37] text-[#1e3a5f] px-7 py-3 rounded-full font-bold hover:bg-[#e0c040] transition shadow-lg cursor-pointer text-sm"
          >
            View All Seasonal Offers <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
