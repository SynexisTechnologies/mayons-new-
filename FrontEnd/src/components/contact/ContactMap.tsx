export default function ContactMap() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[420px]">
      <iframe
        className="w-full h-full"
        src="https://maps.google.com/maps?q=Colombo%2007&t=&z=13&ie=UTF8&iwloc=&output=embed"
        loading="lazy"
        title="Organi Location"
      />
    </div>
  );
}
