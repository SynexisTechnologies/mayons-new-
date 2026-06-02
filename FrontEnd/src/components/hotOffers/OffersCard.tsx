import { Clock } from "lucide-react";
import { Offer } from "../../data/offer";
import ProductCard from "../product/ProductCard";

export default function OfferCard({ offer, onViewDetails }: { offer: Offer; onViewDetails?: () => void }) {
  const now = new Date();
  const end = offer.endDate ? new Date(offer.endDate) : null;

  let daysLeft = 0;
  if (end) {
    daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  const typeClasses: Record<string, string> = {
    DISCOUNT: "bg-honey text-white",
    LIMITED_TIME: "bg-evergreen text-white",
    SEASONAL: "bg-pine text-white",
    CLEARANCE: "bg-clay text-white",
    BOGO: "bg-forest text-white",
    DEFAULT: "bg-stone-500 text-white",
  };

  const typeClass = typeClasses[offer.type] || typeClasses.DEFAULT;

  return (
    <div className="relative">
      {/* Offer type badge */}
      <div
        className={`absolute top-3 left-0 z-20 ${typeClass} pl-3 pr-3.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded-r-full shadow-sm`}
      >
        {offer.type.replace("_", " ")}
      </div>

      {/* Countdown for limited time */}
      {offer.type === "LIMITED_TIME" && (
        <div className="absolute top-3 right-12 z-20 flex items-center gap-1 bg-ink/85 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] font-semibold rounded-full">
          <Clock className="w-3 h-3" />
          {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
        </div>
      )}

      <ProductCard product={offer.product} onViewDetails={onViewDetails} />
    </div>
  );
}
