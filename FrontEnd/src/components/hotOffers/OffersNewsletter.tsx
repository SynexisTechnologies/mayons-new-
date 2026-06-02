import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function OffersNewsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubscribe = () => {
    setError("");
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!isValid(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setSuccess(true);
    setEmail("");
  };

  return (
    <section className="bg-evergreen rounded-[2rem] p-10 sm:p-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-honey rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-sage rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="eyebrow text-honey-light justify-center mb-5">
          <Mail className="w-3.5 h-3.5" /> Stay Updated
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">Never Miss a Hot Deal!</h2>
        <p className="text-white/60 text-[15px] mb-8 max-w-md mx-auto">
          Subscribe and get exclusive offers, seasonal deals, and new arrivals delivered to your
          inbox.
        </p>
        {success ? (
          <div className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
            <CheckCircle className="w-5 h-5 text-honey-light" />
            <p className="text-sm font-semibold">You're subscribed! Watch for exclusive deals.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-full text-sm text-ink placeholder-stone-400 outline-none focus:ring-4 focus:ring-honey/30"
              />
              <button onClick={handleSubscribe} className="btn btn-accent whitespace-nowrap">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-clay-soft text-xs mt-3">{error}</p>}
            <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </section>
  );
}
