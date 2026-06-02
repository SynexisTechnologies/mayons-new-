import { ArrowLeft, Leaf, Eye, EyeOff, Shield, ShoppingBag, Star, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { resendOtp } from "../api/AuthService";
import Logo from "../components/Logo";

const features = [
  { icon: Shield, text: "Secure & encrypted account access" },
  { icon: ShoppingBag, text: "10,000+ certified organic products" },
  { icon: Star, text: "Trusted by 50,000+ families" },
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
    setError("");
    setNotRegistered(false);
    setNotVerified(false);
    setResendSent(false);
    if (!validateEmail(email)) {
      setError(t("invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setError(t("passwordShort"));
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.toLowerCase(), password });
      navigate("/");
    } catch (err: any) {
      const msg = (err.response?.data?.message || "").toLowerCase();
      if (msg.includes("not found")) {
        setError(t("emailNotRegistered"));
        setNotRegistered(true);
      } else if (msg.includes("not verified") || msg.includes("verify your email")) {
        setError("Account not verified. Please check your email for the OTP.");
        setNotVerified(true);
      } else {
        setError(t("invalidCredentials"));
        setShowResetHighlight(true);
      }
    } finally {
      setLoading(false);
    }
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
    } finally {
      setResendLoading(false);
    }
  };

  const inputClass =
    "w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-evergreen/10 focus:border-evergreen focus:bg-white outline-none transition";

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-canvas">
      {/* LEFT — image panel */}
      <div className="hidden md:block relative overflow-hidden bg-evergreen">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80"
          alt="Organic produce"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-evergreen via-evergreen/85 to-forest/60" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-honey rounded-full blur-3xl" />
        </div>

        <div className="absolute top-8 left-8 cursor-pointer" onClick={() => navigate("/")}>
          <Logo height={56} width={150} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <p className="eyebrow text-honey-light mb-5">
            <Leaf className="w-3 h-3" /> Mayan&apos;s Organic
          </p>
          <h2 className="font-display text-5xl font-semibold mb-4 leading-[1.05]">
            Welcome
            <br />
            back.
          </h2>
          <p className="text-white/55 text-sm mb-8 max-w-xs leading-relaxed">
            Sign in to access your organic lifestyle — fresh products, exclusive deals, and more.
          </p>
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/75 text-sm">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-honey-light" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 min-h-screen">
        <div className="mb-8 md:hidden w-fit cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-evergreen rounded-2xl px-3 py-1.5">
            <Logo height={32} width={92} />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-evergreen mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" /> {t("backToHome")}
          </button>

          <h1 className="font-display text-3xl font-semibold text-ink mb-1.5">{t("loginTitle")}</h1>
          <p className="text-stone-400 text-sm mb-8">{t("loginSub")}</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block">
                {t("emailLabel")}
              </label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setNotRegistered(false);
                  setNotVerified(false);
                  setResendSent(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  {t("passwordLabel")}
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className={`text-xs transition ${
                    showResetHighlight
                      ? "text-clay font-semibold"
                      : "text-stone-400 hover:text-evergreen"
                  }`}
                >
                  {t("forgotPassword")}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowResetHighlight(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className={inputClass + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-clay-soft border border-clay/20 px-3.5 py-2.5 rounded-xl space-y-2">
                <p className="text-clay text-xs">{error}</p>
                {notVerified && (
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading || resendSent}
                    className="flex items-center gap-1.5 text-xs font-semibold text-evergreen hover:text-honey transition disabled:opacity-60"
                  >
                    <Mail className="w-3 h-3" />
                    {resendSent
                      ? "Verification email sent!"
                      : resendLoading
                      ? "Sending…"
                      : "Resend verification email"}
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn btn-primary w-full py-3.5 mt-2 disabled:opacity-60"
            >
              {loading ? "Signing in…" : t("signIn")}
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 rule" />
            <span className="text-stone-300 text-xs">or</span>
            <div className="flex-1 rule" />
          </div>

          <p className="text-center text-sm text-stone-400">
            {t("dontHaveAccount")}
            <button
              onClick={() => navigate("/signup")}
              className={`ml-1.5 font-semibold transition ${
                notRegistered ? "text-clay animate-pulse underline" : "text-evergreen hover:text-honey"
              }`}
            >
              {t("signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
