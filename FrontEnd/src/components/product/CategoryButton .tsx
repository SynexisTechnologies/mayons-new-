export const CategoryButton = ({ category, isActive, onClick }: any) => {
  const Icon = category.icon;

  return (
    <button
      onClick={onClick}
      className={`group relative px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_4px_12px_#1e3a5f4d]
        ${isActive ? "bg-[#1e3a5f] text-[#d4af37]" : "bg-white text-[#2a4a7c] hover:bg-[#1e3a5f]/10"}
      `}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${isActive ? "text-[#d4af37]" : "text-[#2a4a7c]"}`} />
        <span className="font-medium">{category.name}</span>
      </div>

      <p className="text-xs mt-1 opacity-70">
        {category.description}
      </p>
    </button>
  );
};
