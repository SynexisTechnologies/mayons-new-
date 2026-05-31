import { ArrowLeft, Leaf, Eye, EyeOff, CheckCircle, Users, Package, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { register, verifyOtp } from "../api/AuthService";
import { useLanguage } from "../context/LanguageContext";

interface RegisterForm {
  firstName: string; lastName: string; email: string;
  phone: string; password: string; confirmPassword: string; otp: string;
}

const features = [
  { icon: Package, text: "Access 10,000+ organic products" },
  { icon: Heart,   text: "Save favorites & track orders" },
  { icon: Users,   text: "Join 50,000+ healthy families" },
];

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [form, setForm] = useState<RegisterForm>({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", otp: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const valid = {
    email: (v: string) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v),
    password: (v: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v),
    phone: (v: string) => {
      if (!v.startsWith("+94")) return t("phoneStart");
      if (!/^\d+$/.test(v.slice(3))) return t("phoneDigits");
      if (v.slice(3).length !== 9) return t("phoneLength");
      return "";
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSendOTP = async () => {
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.confirmPassword) { setError(t("Please fill all fields")); return; }
    if (!valid.email(form.email)) { setError(t("Invalid email address")); return; }
    if (!valid.password(form.password)) { setError(t("passwordRules")); return; }
    if (form.password !== form.confirmPassword) { setError(t("passwordMismatch")); return; }
    const phoneErr = valid.phone(form.phone);
    if (phoneErr) { setError(phoneErr); return; }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, mobile: form.phone, password: form.password, role: "user" });
      setStep("OTP");
    } catch (e: any) { setError(e.response?.data?.message || "Signup failed"); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyOtp({ email: form.email, otp: form.otp });
      setShowSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (e: any) { setError(e.response?.data?.message || "OTP verification failed"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f] outline-none transition";
  const labelCls = "text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ══ LEFT — image panel ══ */}
      <div className="hidden md:block relative overflow-hidden bg-[#1e3a5f]">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80"
          alt="Organic farm"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f]/80 to-[#2a4a7c]/60" />

        <div className="absolute top-10 left-10 flex items-center gap-3 text-white cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          <div>
            <p className="font-extrabold text-lg leading-none">Organi</p>
            <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase">Fresh Product</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-5">
            <Leaf className="w-3 h-3" /> Join Our Community
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Start your<br />healthy journey.
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-xs leading-relaxed">
            Create your account and get access to premium organic products delivered to your door.
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
      <div className="flex flex-col justify-center px-8 sm:px-14 py-12 bg-white overflow-y-auto min-h-screen">
        <div className="flex items-center gap-2 mb-8 md:hidden cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-[#d4af37]" />
          </div>
          <p className="font-extrabold text-[#1e3a5f] text-sm">Organi</p>
        </div>

        <div className="w-full max-w-sm mx-auto md:mx-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#1e3a5f] mb-8 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          {step === "FORM" ? (
            <>
              <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-1">{t("registerTitle")}</h1>
              <p className="text-slate-400 text-sm mb-7">{t("registerSub")}</p>

              {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl mb-4">{error}</p>}

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

                <div>
                  <label className={labelCls}>{t("emailAddress")}</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>{t("phoneNumber")}</label>
                  <input name="phone" value={form.phone} placeholder="+94XXXXXXXXX"
                    onChange={e => {
                      let v = e.target.value;
                      if (!v.startsWith("+94")) v = "+94";
                      v = "+94" + v.slice(3).replace(/\D/g, "").slice(0, 9);
                      setForm(p => ({ ...p, phone: v }));
                    }}
                    className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>{t("password")}</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars with a number" className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3 text-slate-400 cursor-pointer"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t("confirmPassword")}</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-3 text-slate-400 cursor-pointer"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>

                <button onClick={handleSendOTP} disabled={loading}
                  className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-xl font-bold hover:bg-[#2a4a7c] transition disabled:opacity-60 shadow-sm cursor-pointer text-sm mt-1">
                  {loading ? "Sending OTP…" : t("sendOtp")}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-1">Verify your email</h1>
              <p className="text-slate-400 text-sm mb-7">Enter the 6-digit code sent to <span className="font-semibold text-[#1e3a5f]">{form.email}</span></p>

              {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl mb-4">{error}</p>}

              <div className="space-y-4">
                <div className="bg-[#d4af37]/8 border border-[#d4af37]/25 rounded-2xl px-5 py-4 mb-2">
                  <p className="text-xs font-semibold text-[#1e3a5f] mb-0.5">OTP Sent!</p>
                  <p className="text-xs text-slate-500">Check your inbox for the verification code.</p>
                </div>

                <div>
                  <label className={labelCls}>{t("enterOtp")}</label>
                  <input name="otp" value={form.otp} onChange={handleChange} maxLength={6}
                    placeholder="000000"
                    className={`${inputCls} text-center tracking-[0.5em] font-bold text-[#1e3a5f] text-xl`} />
                </div>

                <button onClick={handleVerify} disabled={loading}
                  className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-xl font-bold hover:bg-[#2a4a7c] transition disabled:opacity-60 cursor-pointer text-sm">
                  {loading ? "Verifying…" : t("verifyRegister")}
                </button>

                <button onClick={() => { setStep("FORM"); setError(""); }} className="w-full text-sm text-slate-400 hover:text-[#1e3a5f] transition cursor-pointer py-1">
                  ← Edit details
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-slate-400 mt-6">
            {t("alreadyAccount")}
            <button onClick={() => navigate("/login")} className="ml-1.5 text-[#1e3a5f] font-semibold hover:text-[#d4af37] cursor-pointer transition">{t("signInHere")}</button>
          </p>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[300px] text-center animate-scaleIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1e3a5f] mb-1">All set!</h3>
            <p className="text-slate-400 text-sm">{t("registerSuccess")}</p>
            <p className="text-xs text-slate-300 mt-2">Redirecting to login…</p>
          </div>
        </div>
      )}
    </div>
  );
}
