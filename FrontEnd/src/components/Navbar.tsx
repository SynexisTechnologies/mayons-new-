import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  ChevronDown,
  LogOut,
  LayoutGrid,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";
import { navLinks } from "../data/data";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoriteContext";
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
  const [, setShowSearchOverlay] = useState(false);
  const [, setShowUserMenu] = useState(false);
  const { items } = useCart();
  const { favorites } = useFavorites();
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
    setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
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
        setDbCategories(
          [...cats].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
      } catch {
        /* degrade gracefully */
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
        name.includes(query) || category.includes(query) || subCategory.includes(query)
      );
    });

    const suggestions: {
      type: "product" | "category" | "subcategory";
      label: string;
      value: string;
    }[] = [];

    matchedProducts.slice(0, 6).forEach((p) => {
      suggestions.push({
        type: "product",
        label: language === "si" ? p.nameSi || p.nameEn : p.nameEn || p.nameSi,
        value: language === "si" ? p.nameSi || p.nameEn : p.nameEn || p.nameSi,
      });
    });

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

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts([]);
    setFilteredSuggestions([]);
  };

  const goToSuggestion = (s: { type: string; value: string }) => {
    if (s.type === "product") {
      navigate(`/products?search=${encodeURIComponent(s.value)}`);
    } else {
      navigate(`/products?category=${encodeURIComponent(s.value)}`);
    }
    clearSearch();
    setIsMobileMenuOpen(false);
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
            className="w-full text-left px-3 py-1.5 rounded-lg text-[12.5px] text-stone-500 hover:text-evergreen hover:bg-mist/60 transition-colors font-medium"
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
          className="w-full text-left flex justify-between items-center px-3 py-1.5 rounded-lg text-[12.5px] text-ink hover:text-evergreen hover:bg-mist/60 transition-colors font-semibold"
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
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        {hasChildren && isOpen && (
          <ul className="ml-2 space-y-0.5 border-l border-honey/25 pl-2">
            {item.items!.map((sub) => renderCategory(sub, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  const cartCount = items.length;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-[0_12px_34px_-18px_rgba(36,21,38,0.7)]" : ""
      }`}
    >
      {/* ================= TOP BAR (purple) ================= */}
      <div className="bg-evergreen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] flex items-center gap-4">
          <NavLink to="/" aria-label="Mayons home" className="group">
            <Logo height={46} width={132} className="transition-transform group-hover:scale-[1.03]" />
          </NavLink>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto relative">
            <div className="flex items-center w-full bg-white/15 hover:bg-white/20 focus-within:bg-white/25 border border-white/20 rounded-full pl-5 pr-2 py-1.5 transition">
              <Search className="w-4 h-4 text-white/70 shrink-0" />
              <input
                placeholder={t("search")}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                }}
                className="w-full bg-transparent px-3 py-1 outline-none text-sm text-white placeholder-white/60"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {filteredProducts.length > 0 && (
              <ul
                data-lenis-prevent
                className="absolute top-full mt-2 w-full bg-white border border-stone-100 rounded-2xl shadow-[0_24px_60px_-24px_rgba(36,21,38,0.45)] max-h-80 overflow-y-auto scrollbar-hide z-50 p-1.5 animate-slideDown"
              >
                {filteredSuggestions.map((s, idx) => (
                  <li
                    key={idx + "-sugg"}
                    onClick={() => goToSuggestion(s)}
                    className="px-3.5 py-2.5 cursor-pointer hover:bg-mist/60 rounded-xl flex justify-between items-center group"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-ink">
                      <Search className="w-3.5 h-3.5 text-stone-300 group-hover:text-evergreen transition" />
                      {s.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                      {s.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
            {/* Language */}
            <div className="hidden sm:flex items-center bg-white/12 rounded-full p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-full transition ${
                  language === "en" ? "bg-honey-light text-evergreen shadow-sm" : "text-white/80"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("si")}
                className={`px-2.5 py-1 rounded-full transition ${
                  language === "si" ? "bg-honey-light text-evergreen shadow-sm" : "text-white/80"
                }`}
              >
                සිං
              </button>
            </div>

            {/* Favorites */}
            <button
              onClick={() => navigate("/favorites")}
              aria-label="Favorites"
              className="relative hidden sm:flex w-10 h-10 rounded-full hover:bg-white/12 items-center justify-center text-white transition"
            >
              <Heart className="w-[20px] h-[20px]" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-clay text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Account */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2 pl-1">
                <div className="flex items-center gap-2 bg-white/12 pl-1 pr-3 py-1 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-honey-light text-evergreen flex items-center justify-center text-sm font-bold uppercase">
                    {user.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="leading-tight hidden lg:block">
                    <p className="text-[13px] font-semibold text-white">{user.firstName}</p>
                    <span className="text-[9px] uppercase tracking-wider text-honey-light font-bold">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label={t("logout")}
                  className="w-10 h-10 rounded-full hover:bg-white/12 text-white/80 hover:text-white flex items-center justify-center transition"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:flex w-10 h-10 rounded-full hover:bg-white/12 items-center justify-center text-white transition"
                aria-label="Account"
              >
                <User className="w-[20px] h-[20px]" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
              className="relative w-10 h-10 rounded-full bg-honey-light text-evergreen flex items-center justify-center hover:bg-[#ffd93d] transition shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)]"
            >
              <ShoppingCart className="w-[19px] h-[19px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-clay text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-evergreen">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile toggle */}
            <button
              className="md:hidden w-10 h-10 rounded-full hover:bg-white/12 flex items-center justify-center text-white transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= CATEGORY + LINKS BAR (desktop) ================= */}
      <div className="hidden md:block bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-[52px] flex items-center gap-8">
          <div
            className="relative h-full flex items-center"
            onMouseEnter={openCategoryMenu}
            onMouseLeave={closeCategoryMenu}
          >
            <button className="flex items-center gap-2 text-[13.5px] font-semibold text-white bg-evergreen px-4 py-2 rounded-full hover:bg-forest transition select-none">
              <LayoutGrid className="w-4 h-4" />
              {t("allCategory")}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div
                className="absolute left-0 top-full bg-white shadow-[0_30px_70px_-30px_rgba(36,21,38,0.5)] border border-stone-100 rounded-2xl w-[330px] z-50 overflow-hidden animate-slideDown"
                onMouseEnter={openCategoryMenu}
                onMouseLeave={closeCategoryMenu}
              >
                <div className="px-4 py-3 border-b border-stone-100 bg-cream/60">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Browse by Category
                  </p>
                </div>
                <div data-lenis-prevent className="max-h-[65vh] overflow-y-auto scrollbar-hide p-2">
                  <ul className="space-y-0.5">
                    {dbCategories.map((group) => (
                      <li key={group.titleKey}>
                        <div
                          className="flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer text-evergreen font-semibold text-[13px] hover:bg-mist/60 transition-colors"
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
                          <span>
                            {language === "si"
                              ? t(group.titleKey)
                              : group.name || t(group.titleKey)}
                          </span>
                          {group.items?.length ? (
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                                expandedCategories[group.titleKey] ? "rotate-180" : ""
                              }`}
                            />
                          ) : null}
                        </div>
                        {expandedCategories[group.titleKey] && group.items && (
                          <ul className="ml-2 mb-1 space-y-0.5 border-l-2 border-honey/40 pl-3">
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

          <div className="flex items-center gap-7 flex-1">
            {navLinks
              .filter((link) => !link.adminOnly || user?.role === "admin")
              .map((link) => (
                <NavLink
                  key={link.key}
                  to={link.href}
                  className={({ isActive }) =>
                    `relative text-[13.5px] font-medium transition-colors py-1 ${
                      isActive
                        ? "text-evergreen after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-honey-light"
                        : "text-stone-500 hover:text-evergreen"
                    }`
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div
          data-lenis-prevent
          className="md:hidden fixed inset-x-0 top-[70px] bg-canvas shadow-xl border-t border-stone-200 z-40 max-h-[calc(100vh-70px)] overflow-y-auto overscroll-contain animate-slideDown"
        >
          <div className="flex flex-col p-4 gap-5">
            {/* Search */}
            <div className="relative">
              <div className="flex items-center bg-white border border-stone-200 rounded-full pl-4 pr-2 py-2">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent px-3 outline-none text-sm"
                />
              </div>
              {filteredProducts.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-100 rounded-2xl shadow-xl max-h-64 overflow-y-auto z-50 p-1.5">
                  {filteredSuggestions.map((s, idx) => (
                    <li
                      key={idx}
                      onClick={() => goToSuggestion(s)}
                      className="px-3 py-2.5 cursor-pointer hover:bg-mist/60 rounded-xl flex justify-between items-center"
                    >
                      <span className="text-sm text-ink">{s.label}</span>
                      <span className="text-[10px] uppercase text-stone-400 font-semibold">
                        {s.type}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Language */}
            <div className="flex gap-2">
              {(["en", "si"] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${
                    language === lng
                      ? "bg-evergreen text-white border-evergreen"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  {lng === "en" ? "English" : "සිංහල"}
                </button>
              ))}
            </div>

            {/* Account row */}
            {user ? (
              <div className="flex items-center justify-between bg-white border border-stone-200 rounded-2xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-evergreen text-honey-light flex items-center justify-center font-bold uppercase">
                    {user.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-ink">
                      {user.firstName} {user.lastName}
                    </p>
                    <span className="text-[10px] uppercase tracking-wider text-honey font-bold">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-clay text-sm font-semibold px-3 py-1.5 rounded-full bg-clay-soft"
                >
                  <LogOut className="w-4 h-4" /> {t("logout")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-primary w-full"
              >
                <User className="w-4 h-4" /> {t("signIn")}
              </button>
            )}

            {/* Categories accordion */}
            <button
              onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
              className="flex justify-between items-center font-semibold text-evergreen bg-white border border-stone-200 rounded-2xl px-4 py-3"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> {t("allCategory")}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isMobileCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileCategoryOpen && (
              <div className="space-y-1 -mt-2">
                {dbCategories.map((group) => (
                  <div key={group.titleKey}>
                    <button
                      className="w-full text-left flex justify-between items-center px-3 py-2 rounded-xl text-[13px] font-bold text-evergreen hover:bg-mist/60 transition"
                      onClick={() => {
                        navigate(`/products?category=${group.titleKey.toLowerCase()}`);
                        setIsMobileMenuOpen(false);
                        setIsMobileCategoryOpen(false);
                      }}
                    >
                      {language === "si" ? t(group.titleKey) : group.name || t(group.titleKey)}
                    </button>
                    {group.items && group.items.length > 0 && (
                      <ul className="ml-3 border-l-2 border-honey/30 pl-3 space-y-0.5">
                        {group.items.map((item: any) => renderCategory(item))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-1 border-t border-stone-200 pt-4">
              {navLinks
                .filter((link) => !link.adminOnly || user?.role === "admin")
                .map((link) => (
                  <NavLink
                    key={link.key}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2.5 rounded-xl font-medium transition ${
                        isActive
                          ? "bg-mist/60 text-evergreen"
                          : "text-stone-600 hover:bg-stone-100"
                      }`
                    }
                  >
                    {t(link.key)}
                  </NavLink>
                ))}
              <button
                onClick={() => {
                  navigate("/favorites");
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-stone-100 text-left flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> {t("favorites")}
              </button>
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}
