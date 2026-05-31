import { Offer } from "../../data/offer";
import ProductCard from "../product/ProductCard";

export default function OfferCard({ offer }: { offer: Offer }) {
  const now = new Date();
  const end = offer.endDate ? new Date(offer.endDate) : null;

  let daysLeft = 0;
  if (end) {
    daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  const typeColors: Record<string, string> = {
    DISCOUNT: "bg-yellow-400 text-black",
    LIMITED_TIME: "bg-purple-500 text-white",
    SEASONAL: "bg-green-500 text-white",
    CLEARANCE: "bg-red-500 text-white",
    BOGO: "bg-blue-500 text-white",
    DEFAULT: "bg-gray-400 text-white",
  };

  const typeClass = typeColors[offer.type] || typeColors.DEFAULT;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow hover:shadow-lg transition">
      {/* Product card */}
      <ProductCard product={offer.product} />

      {/* Unique tilted offer badge */}
      <div
        className={`absolute top-2 left-0 transform -translate-x-0.5 -translate-y-0.5 skew-x-[-20deg] px-4 py-1 text-[10px] font-semibold shadow ${typeClass} z-20`}
      >
        <span className="inline-block skew-x-[20deg]">
          {offer.type.replace("_", " ")}
        </span>
      </div>

      {/* Limited time countdown */}
      {offer.type === "LIMITED_TIME" && (
        <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded-full z-20">
          {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
        </div>
      )}
    </div>
  );
}