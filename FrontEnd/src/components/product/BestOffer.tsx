import { useState, useEffect } from "react";
import { ArrowRight, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useLanguage } from "../../context/LanguageContext";
import { Product } from "./types";
import { productService } from "../../services/ProductServices";

export default function BestOffer() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bestOffers, setBestOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getAll()
      .then((data) => {
        setBestOffers(data.filter((p) => p.discount && p.discount > 0).slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 text-[#1e3a5f] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-4">
              <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
              Best Deals
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f]">
              {t("bestOffers")}
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">
              Handpicked discounted products with the best value for your money.
            </p>
          </div>
          <button
            onClick={() => navigate("/offers")}
            className="inline-flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1e3a5f] hover:text-white transition self-start sm:self-auto cursor-pointer flex-shrink-0"
          >
            {t("viewMore")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Products ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="aspect-square bg-slate-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                  <div className="h-9 bg-slate-200 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : bestOffers.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No discounted products available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestOffers.map((product) => (
              <ProductCard key={product._id || product.pluNumber} product={product} />
            ))}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        {!loading && bestOffers.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2a4a7c] transition shadow-md cursor-pointer text-sm"
            >
              Browse All Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
