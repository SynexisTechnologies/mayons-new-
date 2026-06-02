import { ArrowLeft, Leaf, Eye, EyeOff, CheckCircle, Users, Package, Heart, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { register, verifyOtp, resendOtp } from "../api/AuthService";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../components/Logo";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const features = [
  { icon: Package, text: "Access 10,000+ organic products" },
  { icon: Heart, text: "Save favorites & track orders" },
  { icon: Users, text: "Join 50,000+ healthy families" },
];

const RESEND_DELAY = 60;

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setResendCooldown(RESEND_DELAY);
    timerRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const valid = {
    email: (v: string) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v),
    password: (v: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v),
    phone: (v: string) => {
      if (!v.startsWith("+94")) return t("phoneStart");
      if (!/^\d+$/.test(v.slice(3))) return t("phoneDigits");
      if (v.slice(3).length !== 9) return t("phoneLength");
      return "";
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSendOTP = async () => {
    setError("");
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(t("Please fill all fields"));
      return;
    }
    if (!valid.email(form.email)) {
      setError(t("Invalid email address"));
      return;
    }
    if (!valid.password(form.password)) {
      setError(t("passwordRules"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    const phoneErr = valid.phone(form.phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobile: form.phone,
        password: form.password,
        role: "user",
      });
      setStep("OTP");
      startCooldown();
    } catch (e: any) {
      setError(e.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || resending) return;
    setError("");
    setResending(true);
    try {
      await resendOtp({ email: form.email });
      startCooldown();
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!form.otp || form.otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyOtp({ email: form.email, otp: form.otp });
      setShowSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (e: any) {
      setError(e.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-evergreen/10 focus:border-evergreen focus:bg-white outline-none transition";
  const labelCls = "text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-canvas">
      {/* LEFT — image panel */}
      <div className="hidden md:block relative overflow-hidden bg-evergreen">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80"
          alt="Organic farm"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-evergreen via-evergreen/85 to-forest/60" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-honey rounded-full blur-3xl" />
        </div>

        <div className="absolute top-8 left-8 cursor-pointer" onClick={() => navigate("/")}>
          <Logo height={56} width={150} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <p className="eyebrow text-honey-light mb-5">
            <Leaf className="w-3 h-3" /> Join Our Community
          </p>
          <h2 className="font-display text-5xl font-semibold mb-4 leading-[1.05]">
            Start your
            <br />
            healthy journey.
          </h2>
          <p className="text-white/55 text-sm mb-8 max-w-xs leading-relaxed">
            Create your account and get access to premium organic products delivered to your door.
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
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-y-auto min-h-screen">
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

          {step === "FORM" ? (
            <>
              <h1 className="font-display text-3xl font-semibold text-ink mb-1.5">
                {t("registerTitle")}
              </h1>
              <p className="text-stone-400 text-sm mb-7">{t("registerSub")}</p>

              {error && (
                <p className="text-clay text-xs bg-clay-soft border border-clay/20 px-3.5 py-2.5 rounded-xl mb-4">
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>{t("firstName")}</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t("lastName")}</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>{t("emailAddress")}</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t("phoneNumber")}</label>
                    <input
                      name="phone"
                      value={form.phone}
                      placeholder="+94XXXXXXXXX"
                      onChange={(e) => {
                        let v = e.target.value;
                        if (!v.startsWith("+94")) v = "+94";
                        v = "+94" + v.slice(3).replace(/\D/g, "").slice(0, 9);
                        setForm((p) => ({ ...p, phone: v }));
                      }}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>{t("password")}</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="8+ chars: A-Z, a-z, 0-9, symbol"
                        className={`${inputCls} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t("confirmPassword")}</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat password"
                        className={`${inputCls} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="btn btn-primary w-full py-3.5 mt-1 disabled:opacity-60"
                >
                  {loading ? "Sending OTP…" : t("sendOtp")}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-semibold text-ink mb-1.5">Verify your email</h1>
              <p className="text-stone-400 text-sm mb-7">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-evergreen">{form.email}</span>
              </p>

              {error && (
                <p className="text-clay text-xs bg-clay-soft border border-clay/20 px-3.5 py-2.5 rounded-xl mb-4">
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <div className="bg-honey-soft border border-honey/25 rounded-2xl px-5 py-4 mb-2">
                  <p className="text-xs font-semibold text-evergreen mb-0.5">OTP Sent!</p>
                  <p className="text-xs text-stone-500">Check your inbox for the verification code.</p>
                </div>

                <div>
                  <label className={labelCls}>{t("enterOtp")}</label>
                  <input
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    maxLength={6}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    placeholder="000000"
                    className={`${inputCls} text-center tracking-[0.5em] font-bold text-evergreen text-xl`}
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="btn btn-primary w-full py-3.5 disabled:opacity-60"
                >
                  {loading ? "Verifying…" : t("verifyRegister")}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setStep("FORM");
                      setError("");
                      setForm((p) => ({ ...p, otp: "" }));
                    }}
                    className="text-sm text-stone-400 hover:text-evergreen transition"
                  >
                    ← Edit details
                  </button>
                  <button
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0 || resending}
                    className="flex items-center gap-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 text-evergreen hover:text-honey"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            </>
          )}

          <p className="text-center text-sm text-stone-400 mt-6">
            {t("alreadyAccount")}
            <button
              onClick={() => navigate("/login")}
              className="ml-1.5 text-evergreen font-semibold hover:text-honey transition"
            >
              {t("signInHere")}
            </button>
          </p>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[320px] text-center animate-scaleIn">
            <div className="w-16 h-16 bg-pine/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-pine" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-1">All set!</h3>
            <p className="text-stone-400 text-sm">{t("registerSuccess")}</p>
            <p className="text-xs text-stone-300 mt-2">Redirecting to login…</p>
          </div>
        </div>
      )}
    </div>
  );
}
