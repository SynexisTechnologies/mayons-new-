import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OfferService } from "../services/OffersServices";
import OfferCard from "../components/hotOffers/OffersCard";
import { Offer } from "../data/offer";
import { ArrowRight, Leaf } from "lucide-react";
import ProductDetailsModal from "../components/product/ProductDetailsModel";
import { Product } from "../components/product/types";

export default function SeasonalPage() {
  const navigate = useNavigate();
  const [seasonalOffers, setSeasonalOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setLoading(true);
    OfferService.getAll()
      .then((data) => setSeasonalOffers(data.filter((o: Offer) => o.type === "SEASONAL")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative bg-evergreen py-20 md:py-24 overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-honey rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sage rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow text-honey-light justify-center mb-4">
            <Leaf className="w-3.5 h-3.5" />
            Limited Harvest
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Seasonal Collection
          </h2>
          <p className="text-white/55 text-[15px] max-w-xl mx-auto leading-relaxed">
            Fresh seasonal products specially selected for this time of the year — limited
            availability, exclusive deals.
          </p>
        </div>

        {/* Content */}
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
              <OfferCard key={offer._id} offer={offer} onViewDetails={offer.product ? () => setSelectedProduct(offer.product!) : undefined} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/offers?type=SEASONAL")}
            className="btn btn-accent"
          >
            View All Seasonal Offers <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
