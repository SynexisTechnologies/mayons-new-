import { ArrowLeft, Leaf, User, ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { register, verifyOtp } from "../api/AuthService";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function Register() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { items } = useCart();

  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [email, setEmail] = useState("");
  interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    otp: string;
  }

  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [modal, setModal] = useState<{
  type: "success" | "error" | null;
  message: string;
}>({
  type: null,
  message: "",
});
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- VALIDATIONS ---------------- */

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(value);
  };

  const validatePassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const validatePhone = (phone: string) => {
    if (!phone.startsWith("+94")) return t("phoneStart");
    const digits = phone.replace("+94", "");
    if (!/^\d+$/.test(digits)) return t("phoneDigits");
    if (digits.length !== 9) return t("phoneLength");
    return "";
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof RegisterForm;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSendOTP = async () => {
  setError("");
  setSuccess("");

  // Required field check
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

  // Email validation
  if (!validateEmail(form.email)) {
    setError(t("Invalid email address"));
    return;
  }

  // Password validation
  if (!validatePassword(form.password)) {
    setError(t("passwordRules"));
    return;
  }

  // Confirm password check
  if (form.password !== form.confirmPassword) {
    setError(t("passwordMismatch"));
    return;
  }

  // Phone validation
  const phoneError = validatePhone(form.phone);
  if (phoneError) {
    setError(phoneError);
    return;
  }

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
    setSuccess(t("otpSent"));
  } catch (err: any) {
    setError(err.response?.data?.message || "Signup failed");
  }
};

  const handleVerifyAndRegister = async () => {
    try {
      await verifyOtp({ email: form.email, otp: form.otp });
      setModal({
      type: "success",
        message: t("registerSuccess"),
    });
setError("");
setTimeout(() => {
  navigate("/login");
}, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[2fr_3fr] bg-white">

      {/* ================= TOP BAR ================= */}
      <div
        className={`w-full flex items-center justify-between px-4 py-3 fixed top-0 z-50 transition-shadow ${
          isScrolled ? "shadow-lg" : ""
        }`}
        style={{ backgroundColor: "#1e3a5f", boxShadow: isScrolled ? "0 4px 12px #1e3a5f4d" : "none" }}
      >
        <div className="flex items-center gap-2 text-white">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Leaf className="text-[#1e3a5f]" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Organi</h1>
            <p className="text-xs tracking-widest">FRESH PRODUCT</p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 mx-6 relative">
          <input
            placeholder={t("search")}
            className="w-full rounded-full px-5 py-2 outline-none bg-white/20 text-white placeholder-white"
          />
          <Search className="absolute right-4 top-2.5 text-white w-5" />
        </div>

        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "si")}
          className="bg-transparent border border-white text-white rounded px-2 py-1 mr-4"
        >
          <option value="en" className="text-black">EN</option>
          <option value="si" className="text-black">සිං</option>
        </select>

        {/* Cart & User buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => alert("User clicked")}
            className="text-white"
          >
            <User />
          </button>

          <button
            className="relative text-white"
            onClick={() => alert("Cart clicked")}
          >
            <ShoppingCart />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4af37] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* LEFT SIDE – SCROLLABLE */}
      <div className="flex flex-col justify-center px-10 sm:px-16 pt-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2a4a7c] mb-4 w-fit"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-3xl font-bold mb-1">{t("registerTitle")}</h1>
        <p className="text-gray-700 mb-8">{t("registerSub")}</p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        {/* FORM STEP */}
        {step === "FORM" && (
          <>
            <div className="grid grid-cols-2 gap-4 max-w-sm mb-4">
              <div>
                <label className="text-sm font-medium">{t("firstName")} :</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t("lastName")} :</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-[#d4af37] outline-none"
                />
              </div>
            </div>

            <div className="max-w-sm mb-3">
              <label className="text-sm font-medium">{t("emailAddress")} :</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>

            <div className="max-w-sm mb-3">
              <label className="text-sm font-medium">{t("phoneNumber")} :</label>
              <input
                name="phone"
                value={form.phone}
                placeholder="+94XXXXXXXXX"
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith("+94")) value = "+94";
                  const digits = value.slice(3).replace(/\D/g, "");
                  value = "+94" + digits.slice(0, 9);
                  setForm({ ...form, phone: value });
                }}
                className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>

            <div className="max-w-sm mb-3">
              <label className="text-sm font-medium">{t("password")} :</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>

            <div className="max-w-sm mb-5">
              <label className="text-sm font-medium">{t("confirmPassword")} :</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>

            <button
              onClick={handleSendOTP}
              className="w-full max-w-sm bg-[#1e3a5f] text-white py-3 rounded-lg font-semibold hover:bg-[#2a4a7c] transition"
            >
              {t("sendOtp")}
            </button>
          </>
        )}

        {/* OTP STEP */}
        {step === "OTP" && (
          <>
            <div className="max-w-sm mb-5">
              <label className="text-sm font-medium">{t("enterOtp")}</label>
              <input
                name="otp"
                value={form.otp}
                onChange={handleChange}
                className="w-full max-w-sm bg-[#1e3a5f] text-white py-3 rounded-lg font-semibold hover:bg-[#2a4a7c] transition"
              />
            </div>

            <button
              onClick={handleVerifyAndRegister}
              className="w-full max-w-sm bg-[#1e3a5f] text-white py-3 rounded-lg font-semibold hover:bg-[#2a4a7c] transition"
            >
              {t("verifyRegister")}
            </button>
          </>
        )}

        <p className="mt-6 mb-10 text-sm text-gray-600">
          {t("alreadyAccount")}
          <button
            onClick={() => navigate("/login")}
            className="ml-1 text-blue-700 hover:underline font-medium"
          >
            {t("signInHere")}
          </button>
        </p>
      </div>

      {/* RIGHT SIDE – IMAGE */}
      <div className="hidden md:flex relative">
        <img
          src="https://wallpaperaccess.com/full/8620211.jpg"
          alt="Organic Products"
          className="w-full h-full object-cover rounded-md"
        />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/60 via-[#2a4a7c]/40 to-[#1e3a5f]/60 flex flex-col justify-center px-6 md:px-16 animate-fadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-3 md:mb-5 tracking-wide drop-shadow-lg">
            Natural. Sustainable. Pure.
          </h2>
             <p className="text-gray text-sm md:text-lg lg:text-xl max-w-md md:max-w-lg leading-relaxed drop-shadow-md">
            Explore premium organic products for your lifestyle, from eco-friendly skincare to sustainable household essentials.
          </p>
        </div>
      </div>

  {modal.type && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-8 text-center animate-scaleIn">

      <div
        className={`w-20 h-20 mx-auto flex items-center justify-center rounded-full mb-4 ${
          modal.type === "success"
            ? "bg-green-100"
            : "bg-red-100"
        }`}
      >
        {modal.type === "success" ? (
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      <h3
        className={`text-2xl font-bold mb-3 ${
          modal.type === "success"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {modal.type === "success" ? "Success!" : "Error!"}
      </h3>

      <p className="text-gray-600 mb-6">{modal.message}</p>

      <button
        onClick={() => setModal({ type: null, message: "" })}
        className="bg-[#2a4a7c] text-white px-6 py-2 rounded-lg hover:bg-[#1e3a5f]"
      >
        OK
      </button>
    </div>
  </div>
)}
    </div>
  );
}
