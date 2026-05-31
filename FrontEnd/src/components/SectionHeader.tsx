export default function SectionHeader({ title, subtitle }: any) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-[#2a4a7c]">{title}</h2>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
}
