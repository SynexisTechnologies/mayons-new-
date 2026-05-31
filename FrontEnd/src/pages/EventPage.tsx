import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/EventServices";
import { useLanguage } from "../context/LanguageContext";
import EventCard from "../components/events/EventsCard";
import EventsFilter from "../components/events/EventsFilter";
import EventRegistrationModal from "./EventsRegister";

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
    <main className="relative bg-white mt-6 pt-4 pb-5">

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1920&q=80"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center text-white">
          <h1 className="text-3xl sm:text-5xl font-bold mb-6">
            {t("eventsTitle")}
          </h1>

          <p className="text-base sm:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            {t("eventsDesc")}
          </p>

          <button
            onClick={() =>
              document
                .getElementById("events-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#d4af37] text-[#1e3a5f] px-8 py-4 rounded-full hover:bg-[#c5a235] transition shadow-[0_4px_12px_#1e3a5f4d]"
          >
            {t("exploreEvents")}
          </button>
        </div>
      </section>

      <section id="events-section" className="max-w-7xl mx-auto px-4 py-12">
        <EventsFilter selected={selectedCategory} onChange={setSelectedCategory} />

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
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a7c] rounded-3xl p-8 sm:p-12 text-center text-white shadow-[0_4px_12px_#1e3a5f4d]">
          <h2 className="text-2xl sm:text-4xl mb-4">
            {t("ctaTitle1")}
          </h2>

          <p className="text-sm sm:text-lg mb-6 opacity-90">
            {t("ctaDesc")}
          </p>

          <button
            onClick={() => navigate("/contact")}
            className="bg-[#d4af37] text-[#1e3a5f] px-8 py-4 rounded-full font-semibold hover:bg-[#c5a235] transition"
          >
            {t("contactEvents")}
          </button>
        </div>
      </section>

      {selectedEvent && (
        <EventRegistrationModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      )}
    </main>
  );
}
