import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OfferService } from "../services/OffersServices";
import OfferCard from "../components/hotOffers/OffersCard";
import { Offer } from "../data/offer";

export default function SeasonalPage() {
  const navigate = useNavigate();
  const [seasonalOffers, setSeasonalOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await OfferService.getAll();

        // filter SEASONAL offers
        const seasonal = data.filter(
          (offer: Offer) => offer.type === "SEASONAL"
        );

        setSeasonalOffers(seasonal);
      } catch (error) {
        console.error("Failed to fetch seasonal offers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <section className="py-16 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1e3a5f]">
            Seasonal Collection
          </h2>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Discover fresh seasonal products specially selected for this time
            of the year. Enjoy limited seasonal harvests with exclusive deals
            available only for a short period.
          </p>
        </div>
        <div className="text-center mt-10">
  <button
    onClick={() => navigate("/offers?type=SEASONAL")}
    className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-[#163049]"
  >
    View All Seasonal Offers
  </button>
</div>


        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading seasonal products...
          </p>
        )}

        {/* Products Grid */}
        {!loading && seasonalOffers.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {seasonalOffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && seasonalOffers.length === 0 && (
          <p className="text-center text-gray-500">
            No seasonal products available right now.
          </p>
        )}
      </div>
    </section>
  );
}
