import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1e3a5f] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-12">

          {/* BRAND */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#d4af37] rounded-full flex items-center justify-center text-[#1e3a5f] font-black text-sm">M</div>
              <div>
                <p className="font-bold text-white leading-none">Mayan's</p>
                <p className="text-[10px] text-[#d4af37] tracking-widest">ORGANIC</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Fresh, organic, and sustainable products sourced directly from trusted farmers.
            </p>
          </div>

          {/* PAYMENT */}
          <div>
            <h3 className="text-[#d4af37] font-semibold mb-4 text-sm uppercase tracking-wider">Payment</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Cash on Delivery</li>
              <li>Bank Transfer</li>
            </ul>
          </div>

          {/* INFO */}
          <div>
            <h3 className="text-[#d4af37] font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Our Blog", href: "/blog" },
                { label: "Products", href: "/products" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-white/70 hover:text-[#d4af37] transition"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* HEAD OFFICE */}
          <div>
            <h3 className="text-[#d4af37] font-semibold mb-4 text-sm uppercase tracking-wider">Head Office</h3>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>No 46, Old Road<br />Watareka, Meegoda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>+94 XX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>info@mayons.lk</span>
              </div>
            </div>
          </div>

          {/* FOLLOW US */}
          <div>
            <h3 className="text-[#d4af37] font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h3>
            <div className="flex gap-3 mb-4">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:text-[#1e3a5f] transition"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <p className="text-xs text-white/50">Stay connected for fresh updates and exclusive offers.</p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Mayan's Organic Products. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://synexis.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37]/80 hover:text-[#d4af37] transition font-medium"
            >
              Synexis Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
