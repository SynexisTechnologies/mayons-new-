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
    <div className="group card overflow-hidden hover-lift flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />

        {event.statusKey && (
          <span className="absolute top-3 right-3 bg-honey text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {t(event.statusKey)}
          </span>
        )}
        {event.categoryKey && (
          <span className="absolute top-3 left-3 bg-evergreen text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {t(event.categoryKey)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-ink mb-3 leading-snug line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-sm text-stone-500 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            <span>{event.capacity} seats</span>
          </div>
        </div>

        {event.description && (
          <p className="text-xs text-stone-400 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
          <div className="flex items-center gap-1.5 text-evergreen">
            <Tag className="w-3.5 h-3.5" />
            <span className="font-display font-bold">{event.price}</span>
          </div>
          <button
            onClick={onRegister}
            className="flex items-center gap-1.5 bg-evergreen text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-forest transition shadow-sm"
          >
            {t("register")} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
