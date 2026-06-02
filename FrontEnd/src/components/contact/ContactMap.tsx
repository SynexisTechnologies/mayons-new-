export default function ContactMap() {
  return (
    <div className="rounded-[1.75rem] overflow-hidden shadow-lg h-full min-h-[420px] border border-stone-100">
      <iframe
        className="w-full h-full"
        src="https://maps.google.com/maps?q=Watareka%20Meegoda&t=&z=13&ie=UTF8&iwloc=&output=embed"
        loading="lazy"
        title="Mayan's Organic Location"
      />
    </div>
  );
}
