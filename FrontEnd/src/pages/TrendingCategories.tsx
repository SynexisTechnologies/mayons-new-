import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

type FloatingItem = {
  icon: string;
  top?: string;
  left?: string;
  right?: string;
  size: string;
  rotate: string;
};

export default function TrendingCategories() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  /* ================= TRENDING CARDS ================= */
  const categories = [
    {
      title: t("cat_products"),
      subtitle: t("cat_products_sub"),
      gradient: "from-[#2a4a7c] to-[#1e3a5f4d]",
      icon: "🥦",
    },
    {
      title: t("cat_beauty"),
      subtitle: t("cat_beauty_sub"),
      gradient: "from-[#2a4a7c] to-[#1e3a5f4d]",
      icon: "🧴",
    },
    {
      title: t("cat_home"),
      subtitle: t("cat_home_sub"),
      gradient: "from-[#2a4a7c] to-[#1e3a5f4d]",
      icon: "🏡",
    },
  ];

  /* ================= FLOATING ITEMS ================= */
  const floatingItems: FloatingItem[] = [
    { icon: "🥕", top: "8%", left: "6%", size: "text-6xl", rotate: "-15deg" },
    { icon: "🍋", top: "8%", right: "6%", size: "text-7xl", rotate: "12deg" },
    { icon: "🧴", top: "15%", right: "10%", size: "text-5xl", rotate: "-10deg" },
    { icon: "☕", top: "15%", left: "10%", size: "text-6xl", rotate: "18deg" },
    { icon: "👕", top: "12%", right: "15%", size: "text-5xl", rotate: "0deg" },
    { icon: "🍪", top: "12%", left: "15%", size: "text-5xl", rotate: "0deg" },
  ];

  /* ================= ALL CATEGORIES (20) ================= */
  const allCategories = [
    { key: "Meat and Poultry", image: "https://img.freepik.com/free-photo/raw-chicken-fillet-with-garlic-pepper-rosemary-wooden-chopping-board_1150-37784.jpg" },
    { key: "Fruits and Vegetables", image: "https://th.bing.com/th/id/R.0eae128c18f3d9bf47f68c3cd88eded3?rik=vSon220K%2bdBnwg&pid=ImgRaw&r=0" },
    { key: "Grains and Minerals", image: "https://img.freepik.com/premium-photo/collection-grains-isolated-white-background_999327-76532.jpg?w=996" },
    { key: "Dairy Products", image: "https://as1.ftcdn.net/v2/jpg/07/33/86/76/1000_F_733867688_YmSJ32Kv9XP7Ei7eVYCjKV52hxOJHRr9.jpg" },
    { key: "Herbs and Spices", image: "https://th.bing.com/th/id/R.09cae6c1ce7d546c95d2e0cc4b1f6192?rik=tD9jaBqff4tfNA&pid=ImgRaw&r=0" },
    { key: "Packaged Foods", image: "https://c8.alamy.com/comp/G1PG0W/arrangement-of-various-types-of-food-packaging-G1PG0W.jpg" },
    { key: "Snacks", image: "https://thumbs.dreamstime.com/z/snacks-small-amounts-food-eaten-meals-close-up-phot-snacks-small-amounts-food-eaten-meals-close-up-photo-vf-320481137.jpg" },
    { key: "Oilseeds and Oils", image: "https://th.bing.com/th/id/OIP.v-spwH3jz1SOGSqN5LsYfAHaE7?w=273&h=182&c=7&r=0&o=7&cb=defcachec2&dpr=1.3&pid=1.7&rm=3g" },
    { key: "Sweeteners", image: "https://tse4.mm.bing.net/th/id/OIP.0Zv9CB3fs6AtE21JFiJZfwHaEJ?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { key: "Cosmetics", image: "https://images.news18.com/ibnlive/uploads/2021/10/makeup-kit-16349877184x3.jpg" },
    { key: "Skincare", image: "https://png.pngtree.com/thumb_back/fw800/background/20240611/pngtree-natural-skincare-product-assortment-image_15866783.jpg" },
    { key: "Essential Oils", image: "https://aromatherapynaturals.com/wp-content/uploads/2023/10/what-ailments-can-aromatherapy-help_84_IP387094.jpg" },
    { key: "Tea & Coffee", image: "https://tse4.mm.bing.net/th/id/OIP.CqKJe7zNtu1xiWqWnUE3UgHaFj?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { key: "Home Textiles", image: "https://tse1.mm.bing.net/th/id/OIP.coGLFPEsXLx1xyoEIOMqbgHaE8?cb=defcachec2&w=1600&h=1067&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { key: "Apparel", image: "https://static.fibre2fashion.com/Newsresource/images/285/shutterstock-360084356_296925.jpg" },
    { key: "Hoodies", image: "https://tse1.mm.bing.net/th/id/OIP.P5_zivtqQGlGe9qPHSjmcgHaE8?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { key: "Baby Clothing", image: "https://tse3.mm.bing.net/th/id/OIP.DbOotGCr84uYPJDdjEiqJQHaHa?cb=defcachec2&w=626&h=626&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { key: "Pet Products", image: "https://m.media-amazon.com/images/I/81nD4P23IDS._AC_SL1500_.jpg" },
    { key: "Cleaning Products", image: "https://assets.bonappetit.com/photos/63e6c29840953eab0f1ffca3/16:9/w_2560%2Cc_limit/Best_cleaning_products.jpg" },
    { key: "Garden Supplies", image: "https://tse4.mm.bing.net/th/id/OIP.Q8fi6xV3l68Pr-YltvhOYAHaE7?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3" },
  ];

  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden">
      {/* ================= FLOATING ICONS ================= */}
      {floatingItems.map((item, index) => (
        <div
          key={index}
          className={`absolute ${item.size} opacity-80 animate-float`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            transform: `rotate(${item.rotate})`,
            animationDelay: `${index * 0.5}s`,
          }}
        >
          {item.icon}
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-14">
          <div className="flex justify-center items-center gap-2 text-green-700 text-sm font-semibold mb-3">
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            <span>{t("trendingBadge")}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            {t("trendingTitle")}
          </h2>
        </div>

        {/* ================= TRENDING CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`group bg-gradient-to-br ${cat.gradient}
              rounded-3xl p-8 h-64 text-white relative overflow-hidden 
              transform hover:-translate-y-2 transition-all duration-200 shadow-xl`}
            >
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h3 className="text-3xl font-bold">{cat.title}</h3>
              <p className="mt-2 opacity-90">{cat.subtitle}</p>

              <button onClick={() => navigate("/products")}  className="absolute bottom-4 right-6 bg-white text-gray-600 px-4 py-2 rounded-full font-semibold hover:scale-100 transition">
                {t("shopNow")} →
              </button>
            </div>
          ))}
        </div>

        {/* ================= ALL CATEGORIES GRID ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-6">
          {allCategories.map((cat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.key}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 leading-tight">
                {t(cat.key) || cat.key}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
