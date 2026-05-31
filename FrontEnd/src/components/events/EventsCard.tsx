import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Tag,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext"; // <--- import translation

type EventItem = {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  categoryKey: string;
  image: string;
  description: string;
  price: string;
  capacity: number;
  statusKey: string; // keep key
};

type EventCardProps = {
  event: EventItem;
  onRegister?: () => void;
};

export default function EventCard({ event, onRegister }: EventCardProps) {
  const { t } = useLanguage(); // <-- use translation hook

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_#1e3a5f4d] hover:shadow-xl transition group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Status Tag */}
        {event.statusKey && (
          <div className="absolute top-4 right-4 bg-[#d4af37] text-[#1e3a5f] px-3 py-1 rounded-full text-sm font-semibold">
            {t(event.statusKey)}
          </div>
        )}

        {/* Category Tag */}
        {event.categoryKey && (
          <div className="absolute top-4 left-4 bg-[#1e3a5f] text-white px-3 py-1 rounded-full text-sm">
            {t(event.categoryKey)}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-[#1e3a5f]" />
            <span className="text-sm">{event.date}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-[#1e3a5f]" />
            <span className="text-sm">{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-[#1e3a5f]" />
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5 text-[#1e3a5f]" />
            <span className="text-sm">{event.capacity} people</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{event.description}</p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-1 text-[#1e3a5f]">
            <Tag className="w-4 h-4" />
            <span className="font-bold">{event.price}</span>
          </div>

          <button
            onClick={onRegister}
            className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2a4a7c]"
          >
            {t("register")}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
