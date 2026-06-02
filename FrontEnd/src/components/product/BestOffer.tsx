import { useState, useEffect } from "react";
import { ArrowRight, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductDetailsModal from "./ProductDetailsModel";
import { useLanguage } from "../../context/LanguageContext";
import { Product } from "./types";
import { productService } from "../../services/ProductServices";

export default function BestOffer() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bestOffers, setBestOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    <section className="bg-cream/40 py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
          <div>
            <p className="eyebrow text-honey mb-4">
              <Tag className="w-3.5 h-3.5" />
              Best Deals
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink">
              {t("bestOffers")}
            </h2>
            <p className="text-stone-500 text-[15px] mt-3 max-w-sm leading-relaxed">
              Handpicked discounted products with the best value for your money.
            </p>
          </div>
          <button onClick={() => navigate("/offers")} className="btn btn-ghost self-start sm:self-auto">
            {t("viewMore")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 skeleton rounded-full w-3/4" />
                  <div className="h-3 skeleton rounded-full w-1/2" />
                  <div className="h-9 skeleton rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : bestOffers.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No discounted products available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestOffers.map((product) => (
              <ProductCard key={product._id || product.pluNumber} product={product} onViewDetails={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && bestOffers.length > 0 && (
          <div className="text-center mt-14">
            <button onClick={() => navigate("/products")} className="btn btn-primary">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
