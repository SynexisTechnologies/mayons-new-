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

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const filteredEvents =
    selectedCategory === "categoriesAll"
      ? events
      : events.filter((e) => e.categoryKey === selectedCategory);

  return (
    <main className="bg-canvas min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Events"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="relative z-10 min-h-[480px] md:min-h-[560px] max-w-7xl mx-auto flex flex-col justify-center text-white px-6 pt-[120px] md:pt-[150px] pb-14">
          <p className="eyebrow text-honey-light mb-4">
            <Calendar className="w-3.5 h-3.5" /> Upcoming Events
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tight max-w-2xl leading-[1.02]">
            {t("eventsTitle")}
          </h1>
          <p className="text-white/70 text-base max-w-2xl mb-8">{t("eventsDesc")}</p>
          <button
            onClick={() =>
              document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn btn-accent self-start"
          >
            {t("exploreEvents")}
          </button>
        </div>
      </section>

      {/* GRID */}
      <section id="events-section" className="max-w-7xl mx-auto px-6 py-14">
        <EventsFilter selected={selectedCategory} onChange={setSelectedCategory} />

        {events.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <Calendar className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No events scheduled right now.</p>
            <p className="text-sm mt-1">Check back soon for upcoming events!</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p>No events found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={{
                  _id: event._id,
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  categoryKey: event.categoryKey,
                  image: event.image,
                  description: event.description,
                  price: event.price,
                  capacity: event.capacity,
                  statusKey: event.statusKey,
                }}
                onRegister={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden bg-evergreen rounded-[2rem] p-10 sm:p-16 text-center text-white shadow-xl">
          <div className="absolute inset-0 opacity-[0.08]">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-honey rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sage rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <p className="eyebrow text-honey-light justify-center mb-3">Want to partner with us?</p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold mb-4">{t("ctaTitle1")}</h2>
            <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">{t("ctaDesc")}</p>
            <button onClick={() => navigate("/contact")} className="btn btn-accent">
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
