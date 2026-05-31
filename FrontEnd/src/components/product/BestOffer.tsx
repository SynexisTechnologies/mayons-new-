import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useLanguage } from "../../context/LanguageContext";
import { Product } from "./types";
import { productService } from "../../services/ProductServices";

export default function BestOffer() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bestOffers, setBestOffers] = useState<Product[]>([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();

     const discounted = data
          .filter((p) => p.discount && p.discount > 0)
          .slice(0, 4);

      setBestOffers(discounted);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProducts();
}, []);
  // -------------------------------------------------------------------
  // Dummy data for reference (commented)
  /*
  const organicBestOffers: Product[] = [
    {
      id: "1",
      nameKey: "organicBroccoli",
      categoryKey: "VEGETABLES",
      image: "https://tse2.mm.bing.net/th/id/OIP.16tdNXi49BwYbZIHO_1hNAHaE7",
      oldPrice: 12,
      Newprice: 8,
      rating: 4.6,
      reviews: 120,
      description: "organicBroccoliDesc",
      unit: "perKg",
      discount: 20,
    },
    {
      id: "2",
      nameKey: "premiumBeef",
      categoryKey: "MEATS",
      image: "https://th.bing.com/th/id/OIP.Zhrtdc-_pB14j7OELPs32gHaE7",
      oldPrice: 60,
      Newprice: 45,
      rating: 5,
      reviews: 98,
      description: "premiumBeefDesc",
      unit: "perKg",
      discount: 25,
    },
    {
      id: "3",
      nameKey: "frozenPizza",
      categoryKey: "FROZEN",
      image: "https://worldlytreat.com/wp-content/uploads/2021/05/Italian-pepperoni-pizza-recipe-060-500x500.jpg",
      oldPrice: 30,
      Newprice: 22,
      rating: 4.3,
      reviews: 210,
      description: "frozenPizzaDesc",
      unit: "perPack",
      discount: 15,
    },
    {
      id: "4",
      nameKey: "freshSalmon",
      categoryKey: "FISHES",
      image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369",
      oldPrice: 55,
      Newprice: 40,
      rating: 4.9,
      reviews: 160,
      description: "freshSalmonDesc",
      unit: "perKg",
      discount: 20,
    },
  ];
  */
  // -------------------------------------------------------------------

  return (
    <section className="bg-[#f7f7f7] py-20 relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f]">{t("bestOffers")}</h2>
        <button
          onClick={() => navigate("/offers")}
          className="flex items-center gap-2 bg-[#2a4a7c] hover:bg-[#1e3a5f] text-white px-6 py-3 rounded-full"
        >
          {t("viewMore")} <ArrowRight size={18} />
        </button>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {bestOffers.map((product) => (
          <div key={product._id || product.pluNumber} className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
