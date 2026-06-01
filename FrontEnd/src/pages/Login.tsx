import { ArrowLeft, Leaf, Eye, EyeOff, Shield, ShoppingBag, Star, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { resendOtp } from "../api/AuthService";

const features = [
  { icon: Shield,      text: "Secure & encrypted account access" },
  { icon: ShoppingBag, text: "10,000+ certified organic products" },
  { icon: Star,        text: "Trusted by 50,000+ families" },
];

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [showResetHighlight, setShowResetHighlight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const validateEmail = (v: string) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v);

  const handleLogin = async () => {
    setError(""); setNotRegistered(false); setNotVerified(false); setResendSent(false);
    if (!validateEmail(email)) { setError(t("invalidEmail")); return; }
    if (password.length < 6) { setError(t("passwordShort")); return; }
    setLoading(true);
    try {
      await login({ email: email.toLowerCase(), password });
      navigate("/");
    } catch (err: any) {
      const msg = (err.response?.data?.message || "").toLowerCase();
      if (msg.includes("not found")) {
        setError(t("emailNotRegistered")); setNotRegistered(true);
      } else if (msg.includes("not verified") || msg.includes("verify your email")) {
        setError("Account not verified. Please check your email for the OTP.");
        setNotVerified(true);
      } else {
        setError(t("invalidCredentials")); setShowResetHighlight(true);
      }
    } finally { setLoading(false); }
  };

  const handleResendVerification = async () => {
    if (resendLoading || resendSent) return;
    setResendLoading(true);
    try {
      await resendOtp({ email: email.toLowerCase() });
      setResendSent(true);
      setError("");
    } catch {
      setError("Failed to resend verification email.");
    } finally { setResendLoading(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ══ LEFT — image panel ══ */}
      <div className="hidden md:block relative overflow-hidden bg-[#1e3a5f]">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80"
          alt="Organic produce"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f]/80 to-[#2a4a7c]/60" />

        {/* Logo */}
        <div className="absolute top-10 left-10 flex items-center gap-3 text-white cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          <div>
            <p className="font-extrabold text-lg leading-none">Organi</p>
            <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase">Fresh Product</p>
          </div>
        </div>

        {/* Main copy */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-5">
            <Leaf className="w-3 h-3" /> Mayans Organic
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Welcome<br />back.
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-xs leading-relaxed">
            Sign in to access your organic lifestyle — fresh products, exclusive deals, and more.
          </p>
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/70 text-sm">
                <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT — form ══ */}
      <div className="flex flex-col justify-center px-10 sm:px-16 lg:px-20 py-12 bg-white min-h-screen">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 md:hidden cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-[#d4af37]" />
          </div>
          <p className="font-extrabold text-[#1e3a5f] text-sm">Organi</p>
        </div>

        <div className="w-full">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#1e3a5f] mb-8 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-1">{t("loginTitle")}</h1>
          <p className="text-slate-400 text-sm mb-8">{t("loginSub")}</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{t("emailLabel")}</label>
              <input
                value={email}
                onChange={e => { setEmail(e.target.value); setNotRegistered(false); setNotVerified(false); setResendSent(false); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f] outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t("passwordLabel")}</label>
                <button type="button" onClick={() => navigate("/reset-password")}
                  className={`text-xs transition cursor-pointer ${showResetHighlight ? "text-red-500 font-semibold" : "text-slate-400 hover:text-[#1e3a5f]"}`}>
                  {t("forgotPassword")}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setShowResetHighlight(false); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm pr-11 focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f] outline-none transition"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl space-y-2">
                <p className="text-red-500 text-xs">{error}</p>
                {notVerified && (
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading || resendSent}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#1e3a5f] hover:text-[#d4af37] transition cursor-pointer disabled:opacity-60"
                  >
                    <Mail className="w-3 h-3" />
                    {resendSent ? "Verification email sent!" : resendLoading ? "Sending…" : "Resend verification email"}
                  </button>
                )}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading}
              className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-xl font-bold hover:bg-[#2a4a7c] transition disabled:opacity-60 shadow-sm cursor-pointer text-sm mt-2">
              {loading ? "Signing in…" : t("signIn")}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-slate-300 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button onClick={() => navigate("/")}
            className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> {t("backToHome")}
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            {t("dontHaveAccount")}
            <button onClick={() => navigate("/signup")}
              className={`ml-1.5 font-semibold cursor-pointer transition ${notRegistered ? "text-red-500 animate-pulse underline" : "text-[#1e3a5f] hover:text-[#d4af37]"}`}>
              {t("signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
