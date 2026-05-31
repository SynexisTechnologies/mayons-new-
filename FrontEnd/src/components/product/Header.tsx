import { Leaf } from "lucide-react";
import { CategoryButton } from "./CategoryButton ";

export const Header = ({ categories, activeCategory, onCategoryChange }: any) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Leaf className="text-[#d4af37] w-5 h-5" />
        <span className="text-[#d4af37] font-semibold tracking-wider">FRESH FROM OUR FARM</span>
        <Leaf className="text-[#d4af37] w-5 h-5" />
      </div>

      <h1 className="text-5xl font-normal text-[#1e3a5f] mb-14">Good Organic Products</h1>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {categories.map((category: any) => (
          <CategoryButton
            key={category.name}
            category={category}
            isActive={activeCategory === category.name}
            onClick={() => onCategoryChange(category.name)}
          />
        ))}
      </div>
    </div>
  );
};
