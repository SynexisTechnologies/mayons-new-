import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/EventServices";
import { useLanguage } from "../context/LanguageContext";
import EventCard from "../components/events/EventsCard";
import EventsFilter from "../components/events/EventsFilter";
import EventRegistrationModal from "./EventsRegister";
import { Calendar, ArrowRight } from "lucide-react";

export default function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("categoriesAll");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => { getEvents().then(setEvents); }, []);

  const filteredEvents =
    selectedCategory === "categoriesAll"
      ? events
      : events.filter((e) => e.categoryKey === selectedCategory);

  return (
    <main className="bg-slate-50 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Events"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-transparent" />
        </div>
        <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-white text-center px-4 pt-[80px] md:pt-[130px] pb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 px-4 py-1.5 rounded-full mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[#d4af37] text-xs font-bold tracking-widest uppercase">Upcoming Events</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight drop-shadow">
            {t("eventsTitle")}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mb-8">
            {t("eventsDesc")}
          </p>
          <button
            onClick={() => document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 bg-[#d4af37] text-[#1e3a5f] rounded-full font-bold hover:bg-[#e0c040] transition shadow-lg cursor-pointer text-sm"
          >
            {t("exploreEvents")}
          </button>
        </div>
      </section>

      {/* ── EVENTS GRID ── */}
      <section id="events-section" className="max-w-7xl mx-auto px-4 py-12">
        <EventsFilter selected={selectedCategory} onChange={setSelectedCategory} />

        {events.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Calendar className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No events scheduled right now.</p>
            <p className="text-sm mt-1">Check back soon for upcoming events!</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No events found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={{
                  _id: event._id, title: event.title, date: event.date,
                  time: event.time, location: event.location, categoryKey: event.categoryKey,
                  image: event.image, description: event.description,
                  price: event.price, capacity: event.capacity, statusKey: event.statusKey,
                }}
                onRegister={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="relative overflow-hidden bg-[#1e3a5f] rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#d4af37] rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#d4af37] rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <p className="text-[#d4af37] text-xs font-bold tracking-widest uppercase mb-3">Want to partner with us?</p>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">{t("ctaTitle1")}</h2>
            <p className="text-white/70 text-sm sm:text-base mb-8 max-w-xl mx-auto">{t("ctaDesc")}</p>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 bg-[#d4af37] text-[#1e3a5f] px-8 py-3.5 rounded-full font-bold hover:bg-[#e0c040] transition shadow-lg cursor-pointer"
            >
              {t("contactEvents")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {selectedEvent && (
        <EventRegistrationModal selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
      )}
    </main>
  );
}
