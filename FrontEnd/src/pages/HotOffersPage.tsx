import { useEffect, useState } from "react";
import OffersNewsletter from "../components/hotOffers/OffersNewsletter";
import { useLanguage } from "../context/LanguageContext";
import { Offer } from "../data/offer";
import { getAllOffers } from "../api/OfferApi";
import OfferFilters from "../components/hotOffers/OffersFilters";
import OfferCard from "../components/hotOffers/OffersCard";
import OfferHero from "../components/hotOffers/OfferHero";


export default function HotOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selected, setSelected] = useState("ALL");

  useEffect(() => {
    getAllOffers().then(setOffers);
  }, []);

  const filtered = offers.filter((o) => {
    if (selected === "ALL") return true;
    if (selected.toUpperCase() === "DISCOUNT") {
      return o.product?.discount && o.product.discount > 0;
    }
    return o.type?.toUpperCase() === selected.toUpperCase();
  });

  return (
<main className="bg-slate-50 min-h-screen pb-16">
  <OfferHero />

 <section className="max-w-7xl mx-auto px-4 py-8">
  <OfferFilters selected={selected} setSelected={setSelected} />

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {filtered
      .filter((offer) => offer.product) // remove empty offers
      .map((offer) => (
        <OfferCard key={offer._id || offer.product?._id} offer={offer} />
      ))}
  </div>

  <div className="mt-12">
    <OffersNewsletter />
  </div>
</section>
</main>
  );
}