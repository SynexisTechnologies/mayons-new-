import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function OffersNewsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubscribe = () => {
    setError("");
    if (!email.trim()) { setError("Email address is required."); return; }
    if (!isValid(email)) { setError("Please enter a valid email."); return; }
    setSuccess(true);
    setEmail("");
  };

  return (
    <section className="bg-[#1e3a5f] rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#d4af37] rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#d4af37] rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
          <Mail className="w-3.5 h-3.5" />
          Stay Updated
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Never Miss a Hot Deal!</h2>
        <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
          Subscribe and get exclusive offers, seasonal deals, and new arrivals delivered to your inbox.
        </p>
        {success ? (
          <div className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
            <CheckCircle className="w-5 h-5 text-[#d4af37]" />
            <p className="text-sm font-semibold">You're subscribed! Watch for exclusive deals.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-xl text-sm text-[#1e3a5f] placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#d4af37]/60"
              />
              <button onClick={handleSubscribe}
                className="flex items-center justify-center gap-2 bg-[#d4af37] text-[#1e3a5f] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#e0c040] transition shadow-md cursor-pointer whitespace-nowrap">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-red-300 text-xs mt-3">{error}</p>}
            <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </section>
  );
}
