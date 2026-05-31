import { ArrowLeft, Leaf, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [showResetHighlight, setShowResetHighlight] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (v: string) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v);

  const handleLogin = async () => {
    setError("");
    setNotRegistered(false);
    if (!validateEmail(email)) { setError(t("invalidEmail")); return; }
    if (password.length < 6) { setError(t("passwordShort")); return; }
    setLoading(true);
    try {
      await login({ email: email.toLowerCase(), password });
      navigate("/");
    } catch (err: any) {
      const message = (err.response?.data?.message || "").toLowerCase();
      if (message.includes("not found")) {
        setError(t("emailNotRegistered")); setNotRegistered(true);
      } else {
        setError(t("invalidCredentials")); setShowResetHighlight(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1fr] bg-slate-50">

      {/* LEFT — form */}
      <div className="flex flex-col justify-center px-8 sm:px-14 py-12 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-full flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <p className="font-bold text-[#1e3a5f] leading-none text-sm">Organi</p>
            <p className="text-[9px] tracking-widest text-slate-400">FRESH PRODUCT</p>
          </div>
        </div>

        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1e3a5f] mb-6 w-fit transition">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-1">{t("loginTitle")}</h1>
        <p className="text-sm text-slate-500 mb-8">{t("loginSub")}</p>

        <div className="space-y-4 max-w-sm">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{t("emailLabel")}</label>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); setNotRegistered(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="you@example.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{t("passwordLabel")}</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setShowResetHighlight(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-semibold hover:bg-[#2a4a7c] transition disabled:opacity-60 shadow-sm"
          >
            {loading ? "Signing in…" : t("signIn")}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={15} /> {t("backToHome")}
          </button>
        </div>

        <div className="mt-6 text-sm text-slate-500 space-y-1.5 max-w-sm">
          <p>
            {t("dontHaveAccount")}
            <button
              onClick={() => navigate("/signup")}
              className={`ml-1 font-medium ${notRegistered ? "text-red-500 animate-pulse underline" : "text-[#1e3a5f] hover:underline"}`}
            >
              {t("signUp")}
            </button>
          </p>
          <p>
            {t("forgotPassword")}
            <button
              onClick={() => navigate("/reset-password")}
              className={`ml-1 font-medium ${showResetHighlight ? "text-red-500 animate-pulse underline" : "text-[#1e3a5f] hover:underline"}`}
            >
              {t("reset")}
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT — visual */}
      <div className="hidden md:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80"
          alt="Organic Products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/80 via-[#1e3a5f]/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <p className="text-[#d4af37] text-xs font-bold tracking-[0.25em] uppercase mb-3">Mayans Organic</p>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">Natural.<br />Sustainable.<br />Pure.</h2>
          <p className="text-white/70 text-sm max-w-xs leading-relaxed">
            Premium organic products for a healthier, more sustainable lifestyle.
          </p>
        </div>
      </div>
    </div>
  );
}
