import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Logo from "../Logo";

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <footer className="relative bg-evergreen text-white mt-24 overflow-hidden">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-honey rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-0 w-[28rem] h-[28rem] bg-sage rounded-full blur-3xl" />
      </div>

      {/* Newsletter band */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16">
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <p className="eyebrow text-honey-light mb-2">Stay Fresh</p>
            <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight">
              Get fresh drops & exclusive organic offers
            </h3>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full md:w-auto items-center bg-white rounded-full p-1.5 pl-5 max-w-md md:min-w-[380px]"
          >
            <Mail className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder-stone-400"
            />
            <button type="submit" className="btn btn-accent text-sm py-2.5 px-5">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid gap-10 grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Logo height={64} width={170} className="-ml-2 mb-3" />
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Fresh, organic, and sustainable products sourced directly from trusted farmers across
              Sri Lanka.
            </p>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-honey-light font-semibold mb-4 text-xs uppercase tracking-[0.18em]">
              Payment
            </h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li>Cash on Delivery</li>
              <li>Bank Transfer</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-honey-light font-semibold mb-4 text-xs uppercase tracking-[0.18em]">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t("about"), href: "/about" },
                { label: t("contactTitle"), href: "/contact" },
                { label: t("blog"), href: "/blog" },
                { label: t("products"), href: "/products" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="group inline-flex items-center gap-1.5 text-white/65 hover:text-honey-light transition"
                  >
                    <ArrowRight className="w-3 h-3 -ml-4 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Head office */}
          <div>
            <h4 className="text-honey-light font-semibold mb-4 text-xs uppercase tracking-[0.18em]">
              Head Office
            </h4>
            <div className="space-y-3 text-sm text-white/65">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-honey-light flex-shrink-0 mt-0.5" />
                <span>
                  No 46, Old Road
                  <br />
                  Watareka, Meegoda
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-honey-light" />
                <span>+94 70 244 23 17</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-honey-light" />
                <span>info@mayons.lk</span>
              </div>
              <div className="flex gap-2.5 pt-2">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-honey hover:text-evergreen transition"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Mayan&apos;s Organic Products. {t("allRightsReserved")}.</p>
          <p>
            Developed by{" "}
            <a
              href="https://synexis.one"
              target="_blank"
              rel="noopener noreferrer"
              className="text-honey-light/80 hover:text-honey-light transition font-medium"
            >
              Synexis.one
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
