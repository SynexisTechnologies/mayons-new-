import { Calendar, MapPin, Clock, Users, ArrowRight, Tag } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

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
  statusKey: string;
};

type Props = {
  event: EventItem;
  onRegister?: () => void;
};

export default function EventCard({ event, onRegister }: Props) {
  const { t } = useLanguage();

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {event.statusKey && (
          <span className="absolute top-3 right-3 bg-[#d4af37] text-[#1e3a5f] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow">
            {t(event.statusKey)}
          </span>
        )}
        {event.categoryKey && (
          <span className="absolute top-3 left-3 bg-[#1e3a5f] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {t(event.categoryKey)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-[#1e3a5f] mb-3 leading-snug line-clamp-2">{event.title}</h3>

        <div className="space-y-1.5 text-sm text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#1e3a5f]/40 flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#1e3a5f]/40 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#1e3a5f]/40 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#1e3a5f]/40 flex-shrink-0" />
            <span>{event.capacity} seats</span>
          </div>
        </div>

        {event.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-1.5 text-[#1e3a5f]">
            <Tag className="w-3.5 h-3.5" />
            <span className="font-extrabold text-sm">{event.price}</span>
          </div>
          <button
            onClick={onRegister}
            className="flex items-center gap-1.5 bg-[#1e3a5f] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#2a4a7c] transition shadow-sm cursor-pointer"
          >
            {t("register")} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
