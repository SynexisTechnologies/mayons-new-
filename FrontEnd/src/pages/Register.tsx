import { ArrowLeft, Leaf, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { register, verifyOtp } from "../api/AuthService";
import { useLanguage } from "../context/LanguageContext";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [form, setForm] = useState<RegisterForm>({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", otp: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmail = (v: string) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v);
  const validatePassword = (p: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(p);
  const validatePhone = (p: string) => {
    if (!p.startsWith("+94")) return t("phoneStart");
    if (!/^\d+$/.test(p.slice(3))) return t("phoneDigits");
    if (p.slice(3).length !== 9) return t("phoneLength");
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOTP = async () => {
    setError(""); setSuccess("");
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError(t("Please fill all fields")); return;
    }
    if (!validateEmail(form.email)) { setError(t("Invalid email address")); return; }
    if (!validatePassword(form.password)) { setError(t("passwordRules")); return; }
    if (form.password !== form.confirmPassword) { setError(t("passwordMismatch")); return; }
    const phoneError = validatePhone(form.phone);
    if (phoneError) { setError(phoneError); return; }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, mobile: form.phone, password: form.password, role: "user" });
      setStep("OTP");
      setSuccess(t("otpSent"));
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    setLoading(true);
    try {
      await verifyOtp({ email: form.email, otp: form.otp });
      setShowSuccessModal(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1fr] bg-slate-50">

      {/* LEFT — form */}
      <div className="flex flex-col justify-center px-8 sm:px-14 py-12 bg-white overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-full flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <p className="font-bold text-[#1e3a5f] leading-none text-sm">Organi</p>
            <p className="text-[9px] tracking-widest text-slate-400">FRESH PRODUCT</p>
          </div>
        </div>

        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1e3a5f] mb-5 w-fit transition">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-1">{t("registerTitle")}</h1>
        <p className="text-sm text-slate-500 mb-6">{t("registerSub")}</p>

        {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}
        {success && <p className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg mb-4">{success}</p>}

        {step === "FORM" && (
          <div className="space-y-4 max-w-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{t("firstName")}</label>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{t("lastName")}</label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{t("emailAddress")}</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{t("phoneNumber")}</label>
              <input name="phone" value={form.phone} placeholder="+94XXXXXXXXX"
                onChange={(e) => {
                  let v = e.target.value;
                  if (!v.startsWith("+94")) v = "+94";
                  v = "+94" + v.slice(3).replace(/\D/g, "").slice(0, 9);
                  setForm({ ...form, phone: v });
                }}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{t("password")}</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{t("confirmPassword")}</label>
              <div className="relative">
                <input type={showConfirmPw ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition" />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button onClick={handleSendOTP} disabled={loading}
              className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-semibold hover:bg-[#2a4a7c] transition disabled:opacity-60 shadow-sm">
              {loading ? "Sending…" : t("sendOtp")}
            </button>
          </div>
        )}

        {step === "OTP" && (
          <div className="space-y-4 max-w-sm">
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4 text-sm text-[#1e3a5f]">
              <p className="font-semibold mb-1">OTP sent!</p>
              <p className="text-slate-500 text-xs">Check your email <strong>{form.email}</strong> for a verification code.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{t("enterOtp")}</label>
              <input
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-center tracking-[0.3em] font-semibold text-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition"
              />
            </div>
            <button onClick={handleVerifyAndRegister} disabled={loading}
              className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-semibold hover:bg-[#2a4a7c] transition disabled:opacity-60 shadow-sm">
              {loading ? "Verifying…" : t("verifyRegister")}
            </button>
            <button onClick={() => { setStep("FORM"); setError(""); setSuccess(""); }}
              className="w-full text-sm text-slate-500 hover:text-[#1e3a5f] transition">
              ← Edit details
            </button>
          </div>
        )}

        <p className="mt-6 text-sm text-slate-500 max-w-sm">
          {t("alreadyAccount")}
          <button onClick={() => navigate("/login")} className="ml-1 text-[#1e3a5f] font-medium hover:underline">{t("signInHere")}</button>
        </p>
      </div>

      {/* RIGHT — visual */}
      <div className="hidden md:block relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80" alt="Organic Farm"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/80 via-[#1e3a5f]/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <p className="text-[#d4af37] text-xs font-bold tracking-[0.25em] uppercase mb-3">Join Our Community</p>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">Fresh.<br />Organic.<br />Delivered.</h2>
          <p className="text-white/70 text-sm max-w-xs leading-relaxed">
            Join thousands of families making healthier choices with Mayan's organic products.
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[320px] text-center animate-scaleIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Registration Successful!</h3>
            <p className="text-slate-500 text-sm">{t("registerSuccess")}</p>
            <p className="text-xs text-slate-400 mt-2">Redirecting to login…</p>
          </div>
        </div>
      )}
    </div>
  );
}
