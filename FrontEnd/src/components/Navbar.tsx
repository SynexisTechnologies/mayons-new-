                                                                                                                                                                                                                                                                                                                           import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Leaf,
  Search,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { useLanguage } from "../context/LanguageContext";
import { navLinks } from "../data/data";
import { useAuth } from "../context/AuthContext";
import { getAllcat } from "../services/CategoryServices";
import { productService } from "../services/ProductServices";
import { Product } from "../components/product/types";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const categoryCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { items } = useCart();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    { type: "product" | "category" | "subcategory"; label: string; value: string }[]
  >([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

const toggleCategory = (key: string) => {
  setExpandedCategories((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};

const openCategoryMenu = () => {
  if (categoryCloseTimer.current) clearTimeout(categoryCloseTimer.current);
  setIsCategoryOpen(true);
};

const closeCategoryMenu = () => {
  categoryCloseTimer.current = setTimeout(() => setIsCategoryOpen(false), 150);
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setAllProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const cats = await getAllcat();
        // Sort by createdAt ascending to preserve the seeded order
        setDbCategories([...cats].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      } catch {
        // silently fall back to empty — the UI degrades gracefully
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    navigate("/", { replace: true });
    logout();
  };

  // close overlays on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearchOverlay(false);
        setShowUserMenu(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const query = value.trim().toLowerCase();

  setSearchQuery(value);

  if (!query) {
    setFilteredProducts([]);
    setFilteredSuggestions([]);
    return;
  }

  const matchedProducts = allProducts.filter((product) => {
    const name =
      language === "si"
        ? (product.nameSi || "").toLowerCase()
        : (product.nameEn || "").toLowerCase();

    const category = (
      typeof product.category === "string"
        ? product.category
        : (product.category as any)?.name || ""
    ).toLowerCase();

    const subCategory = (
      typeof product.subCategory === "string"
        ? product.subCategory
        : (product.subCategory as any)?.name || ""
    ).toLowerCase();

    return (
      name.includes(query) ||
      category.includes(query) ||
      subCategory.includes(query)
    );
  });

  // Build suggestions: unique products, plus any matching category/subcategory labels
  const suggestions: { type: "product" | "category" | "subcategory"; label: string; value: string }[] = [];

  matchedProducts.slice(0, 6).forEach((p) => {
    suggestions.push({
      type: "product",
      label: language === "si" ? p.nameSi || p.nameEn : p.nameEn || p.nameSi,
      value: language === "si" ? p.nameSi || p.nameEn : p.nameEn || p.nameSi,
    });
  });

  // categories from DB and their items
dbCategories.forEach((group: any) => {
  group.items?.forEach((sub: any) => {
    if (typeof sub === "string") {
      const lbl = t(sub).toLowerCase();
      if (lbl.includes(query) && !suggestions.find((s) => s.value === sub)) {
        suggestions.push({ type: "subcategory", label: t(sub), value: sub });
      }
    } else if (typeof sub === "object" && sub.titleKey) {
      sub.items?.forEach((inner: any) => {
        if (typeof inner === "string") {
          const lbl = t(inner).toLowerCase();
          if (lbl.includes(query) && !suggestions.find((s) => s.value === inner)) {
            suggestions.push({ type: "subcategory", label: t(inner), value: inner });
          }
        }
      });
    }
  });
});

  setFilteredProducts(matchedProducts.slice(0, 20));
  setFilteredSuggestions(suggestions);
};

const renderCategory = (
  item: string | { titleKey: string; items?: any[] },
  level: number = 0
) => {
  if (typeof item === "string") {
    return (
      <li key={item}>
        <button
          onClick={() => {
            navigate(`/products?category=${item}`);
            setIsCategoryOpen(false);
            setIsMobileMenuOpen(false);
            setIsMobileCategoryOpen(false);
          }}
          className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] text-slate-600 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-colors font-medium"
        >
          {t(item)}
        </button>
      </li>
    );
  }

  const hasChildren = item.items && item.items.length > 0;
  const isOpen = expandedCategories[item.titleKey];

  return (
    <li key={item.titleKey}>
      <button
        className="w-full text-left flex justify-between items-center px-2 py-1.5 rounded-lg text-[12px] text-slate-700 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-colors font-semibold"
        onClick={() => {
          if (hasChildren) {
            toggleCategory(item.titleKey);
          } else {
            navigate(`/products?category=${item.titleKey.toLowerCase()}`);
            setIsCategoryOpen(false);
            setIsMobileMenuOpen(false);
            setIsMobileCategoryOpen(false);
          }
        }}
      >
        <span>{t(item.titleKey)}</span>
        {hasChildren && (
          <span className={`text-[10px] text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
        )}
      </button>
      {hasChildren && isOpen && (
        <ul className="ml-2 space-y-0.5 border-l border-[#d4af37]/20 pl-2">
          {item.items!.map((sub) => renderCategory(sub, level + 1))}
        </ul>
      )}
    </li>
  );
};

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? "shadow-[0_4px_10px_#1e3a5f4d]" : ""
      }`}
      style={{ backgroundColor: "#1e3a5f" }}
    >
      {/* ================= TOP BAR ================= */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between h-[72px]">
        <NavLink to="/" className="flex items-center gap-2 text-white">
          <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
            <Leaf className="text-[#1e3a5f]" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Organi</h1>
            <p className="text-xs tracking-widest">FRESH PRODUCT</p>
          </div>
        </NavLink>

        {/* Search */}
<div className="hidden md:flex flex-1 mx-6 relative">
  <input
    placeholder={t("search")}
    value={searchQuery}
    onChange={handleSearchChange}
    className="hidden md:block w-full rounded-full px-5 py-2 outline-none bg-white/20 text-white placeholder-white"
  />
  <Search
   className="hidden md:block absolute right-4 top-2.5 text-white w-5 cursor-pointer"
    onClick={() => navigate(`/products?search=${searchQuery}`)}
  />

  {filteredProducts.length > 0 && (
      <ul className="absolute top-full mt-1 w-full bg-white text-black rounded shadow-lg max-h-64 overflow-y-auto z-50">
        {filteredSuggestions.map((s, idx) => (
          <li
            key={idx + "-sugg"}
            onClick={() => {
              if (s.type === "product") {
                navigate(`/products?search=${encodeURIComponent(s.value)}`);
              } else if (s.type === "subcategory") {
                navigate(`/products?category=${encodeURIComponent(s.value)}`);
              } else {
                navigate(`/products?category=${encodeURIComponent(s.value)}`);
              }

              setSearchQuery("");
              setFilteredProducts([]);
              setFilteredSuggestions([]);
            }}
            className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
          >
            <span>{s.label}</span>
            <span className="text-xs text-gray-400">{s.type}</span>
          </li>
        ))}
      </ul>
  )}
</div>


        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "si")}
  className="hidden md:block bg-transparent border border-[#d4af37] text-white rounded px-2 py-1 mr-4"
        >
          <option value="en" className="text-black">EN</option>
          <option value="si" className="text-black">සිං</option>
        </select>

{user ? (
  <div className="flex items-center gap-4 mr-4 text-white">

    {/* Avatar + Name */}
    <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-full">
      <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-[#1e3a5f] text-sm font-semibold">
        {user.firstName.charAt(0)}
      </div>

      <div className="leading-tight hidden sm:block">
        <p className="text-sm font-medium">
          {user.firstName} {user.lastName}
        </p>
        <span className="text-[10px] uppercase tracking-wide text-[#d4af37]">
          {user.role}
        </span>
      </div>
    </div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full 
                 border border-red-400 text-red-400 text-xs font-medium
                 hover:bg-red-500 hover:text-white hover:border-red-500
                 transition-all duration-200"
    >
      <X size={14} />
      {t("logout")}
    </button>

  </div>
) : (
  <button
    onClick={() => navigate("/login")}
    className="text-white mr-4"
  >
    <User />
  </button>
)}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative text-white mr-4"
        >
          <ShoppingCart />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#d4af37] text-[#1e3a5f] text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
<div className="bg-white hidden md:block"> 
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center relative">
<div
  className="relative font-medium text-[#1e3a5f]"
  onMouseEnter={openCategoryMenu}
  onMouseLeave={closeCategoryMenu}
>
  <span className="cursor-pointer hover:text-[#2a4a7c] select-none">
    ☰ {t("allCategory")}
  </span>

  {isCategoryOpen && (
  <div
    className="absolute left-0 top-full mt-2 bg-white shadow-2xl border border-slate-100 rounded-2xl w-[320px] z-50 overflow-hidden"
    onMouseEnter={openCategoryMenu}
    onMouseLeave={closeCategoryMenu}
  >
    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/80">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Browse by Category</p>
    </div>

    <div className="max-h-[65vh] overflow-y-auto scrollbar-hide p-2">
      <ul className="space-y-0.5">
        {dbCategories.map((group) => (
          <li key={group.titleKey}>
            <div
              className="flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer text-[#1e3a5f] font-semibold text-[13px] hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f] transition-colors"
              onClick={() => {
                if (group.items?.length) {
                  toggleCategory(group.titleKey);
                } else {
                  navigate(`/products?category=${group.titleKey.toLowerCase()}`);
                  setIsCategoryOpen(false);
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              <span>{language === "si" ? t(group.titleKey) : (group.name || t(group.titleKey))}</span>
              {group.items?.length ? (
                <span className={`text-[10px] text-slate-400 transition-transform ${expandedCategories[group.titleKey] ? "rotate-90" : ""}`}>▶</span>
              ) : null}
            </div>

            {expandedCategories[group.titleKey] && group.items && (
              <ul className="ml-2 mb-1 space-y-0.5 border-l-2 border-[#d4af37]/30 pl-3">
                {group.items.map((item: any) => renderCategory(item, 1))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

</div>

          {/* Desktop Links */}
          <div className="flex gap-10 justify-center flex-1 ml-10">
  {navLinks
    .filter((link) => !link.adminOnly || user?.role === "admin")
    .map((link) => (

              <NavLink
                key={link.key}
                to={link.href}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#1e3a5f] font-medium underline underline-offset-8 decoration-[#1e3a5f]"
                    : "text-[#2a4a7c] hover:text-[#d4af37]"
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
</div></div>

          </div>
           {/* ================= MOBILE MENU ================= */}
{isMobileMenuOpen && (
  <div className="md:hidden fixed inset-x-0 top-[72px] bg-white shadow-xl border-t z-40 max-h-[calc(100vh-72px)] overflow-y-auto overscroll-contain">
    <div className="flex flex-col p-4 gap-5">

{/* Mobile Search */}
<div className="relative">
  <input
    placeholder={t("search")}
    value={searchQuery}
    onChange={handleSearchChange}
    className="w-full rounded-full px-4 py-2 outline-none border border-gray-300"
  />

  {filteredProducts.length > 0 && (
    <ul className="absolute left-0 right-0 top-full mt-2 w-full bg-white text-black rounded shadow-lg max-h-64 overflow-y-auto z-50">
      {filteredSuggestions.map((s, idx) => (
        <li
          key={idx}
  onClick={() => {
  if (s.type === "product") {
    navigate(`/products?search=${s.value}`);
  } 
  else if (s.type === "subcategory") {
    navigate(`/products?category=${s.value}`);
  } 
  else {
    navigate(`/products?category=${s.value}`);
  }

  setSearchQuery("");
  setFilteredProducts([]);
  setFilteredSuggestions([]);
  setIsMobileMenuOpen(false);
}}
          className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
        >
          <span>{s.label}</span>
          <span className="text-xs text-gray-400">{s.type}</span>
        </li>
      ))}
    </ul>
  )}
</div>

      {/* Mobile Language Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 rounded border ${
            language === "en"
              ? "bg-[#1e3a5f] text-white"
              : "border-gray-300 text-gray-700"
          }`}
        >
          EN
        </button>

        <button
          onClick={() => setLanguage("si")}
          className={`px-3 py-1 rounded border ${
            language === "si"
              ? "bg-[#1e3a5f] text-white"
              : "border-gray-300 text-gray-700"
          }`}
        >
          සිං
        </button>
      </div>

      {/* Mobile Categories */}
      <button
        onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
        className="flex justify-between items-center font-semibold text-[#1e3a5f]"
      >
        ☰ {t("allCategory")}
        <span>{isMobileCategoryOpen ? "−" : "+"}</span>
      </button>

{isMobileCategoryOpen && (
  <div className="space-y-1">
    {dbCategories.map((group) => (
      <div key={group.titleKey}>
        <button
          className="w-full text-left flex justify-between items-center px-3 py-2 rounded-xl text-[13px] font-bold text-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition"
          onClick={() => {
            navigate(`/products?category=${group.titleKey.toLowerCase()}`);
            setIsMobileMenuOpen(false);
            setIsMobileCategoryOpen(false);
          }}
        >
          {language === "si" ? t(group.titleKey) : (group.name || t(group.titleKey))}
        </button>
        {group.items && group.items.length > 0 && (
          <ul className="ml-3 border-l-2 border-[#d4af37]/30 pl-3 space-y-0.5">
            {group.items.map((item: any) => renderCategory(item))}
          </ul>
        )}
      </div>
    ))}
  </div>
)}

      {/* Mobile Links */}
      <div className="flex flex-col gap-3 border-t pt-4">

       {navLinks
  .filter((link) => !link.adminOnly || user?.role === "admin")
  .map((link) => (
    <NavLink
      key={link.key}
      to={link.href}
      onClick={() => setIsMobileMenuOpen(false)}
      className="text-[#1e3a5f] font-medium"
    >
      {t(link.key)}
    </NavLink>
))}

      </div>
    </div>
  </div>
)}


      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );} 