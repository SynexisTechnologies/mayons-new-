import { ArrowLeft, Leaf, User, ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import ResetEmailForm from "../components/reset/ResetEmailForm";
import ResetAccountPreview from "../components/reset/ResetAccountPreview";
import { getResetUser, resetPassword, requestPasswordResetOTP, verifyPasswordResetOTP } from "../api/AuthService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { items } = useCart();

  const [step, setStep] = useState<"EMAIL" | "PREVIEW" | "OTP">("EMAIL");
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{ type: string | null; message: string }>({
    type: null,
    message: "",
  });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- HANDLE EMAIL SUBMIT ---------------- */

  const handleEmailSubmit = async (email: string) => {
    setError("");
    try {
      const res = await getResetUser(email);

      // Support multiple response shapes:
      // 1) { success: true, user: { ... } }
      // 2) { email: 'x', firstName: 'x', ... } (user object directly)
      // 3) { message: '...' } -> error
      if (!res) {
        setError("Unexpected response from server");
        return;
      }

      if (res.message && !res.user && !res.email) {
        setError(res.message);
        return;
      }

      const userObj = res.user || (res.email ? res : null);
      if (!userObj) {
        setError(res.message || "User not found");
        return;
      }

      setUserData(userObj);
      setStep("PREVIEW");
    } catch {
      setError("Something went wrong.");
    }
  };



  /* ---------------- HANDLE PASSWORD SAVE ---------------- */

const handleSavePassword = async (password: string) => {
  try {
    const res = await resetPassword(userData.email, password);

    // If backend explicitly returns success false
    if (res?.success === false) {
      setModal({
        type: "error",
        message: res.message || "Password reset failed.",
      });
      return;
    }

    // If backend explicitly returns success true
    if (res?.success === true) {
      setModal({
        type: "success",
        message: res.message || t("passwordResetSuccess"),
      });
      return;
    }

    // If backend does NOT send success field
    // Assume success only if no error message
    if (!res?.message) {
      setModal({
        type: "success",
        message: t("passwordResetSuccess"),
      });
    } else {
      setModal({
        type: "error",
        message: res.message,
      });
    }

  } catch (err: any) {
    setModal({
      type: "error",
      message:
        err?.response?.data?.message ||
        "Password reset failed.",
    });
  }
};

  return (
    <div className="min-h-screen grid md:grid-cols-[2fr_3fr] bg-white">

      {/* ================= NAVBAR ================= */}
      <div
        className={`w-full flex items-center justify-between px-4 py-3 fixed top-0 z-50 transition-shadow ${
          isScrolled ? "shadow-lg" : ""
        }`}
        style={{
          backgroundColor: "#1e3a5f",
          boxShadow: isScrolled ? "0 4px 12px #1e3a5f4d" : "none",
        }}
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

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "si")}
          className="bg-transparent border border-white text-white rounded px-2 py-1 mr-4"
        >
          <option value="en" className="text-black">EN</option>
          <option value="si" className="text-black">සිං</option>
        </select>

        <div className="flex items-center gap-4">
          <button className="text-white">
            <User />
          </button>

          <button className="relative text-white">
            <ShoppingCart />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4af37] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= LEFT SIDE ================= */}
      <div className="flex flex-col justify-center px-10 sm:px-16 pt-24">


        {step === "EMAIL" && (
          <ResetEmailForm
            onSubmit={handleEmailSubmit}
            error={error}
          />
        )}

     {step === "PREVIEW" && userData && (
  <ResetAccountPreview
    user={userData}
    onBack={() => setStep("EMAIL")}
    error={error}
  />
)}
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="hidden md:flex relative">
        <img
          src="https://wallpaperaccess.com/full/8620211.jpg"
          alt="Organic Products"
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/60 via-[#2a4a7c]/40 to-[#1e3a5f]/60 flex flex-col justify-center px-16">
          <h2 className="text-5xl font-extrabold text-[#d4af37] mb-5 tracking-wide drop-shadow-lg">
            Secure. Reliable. Protected.
          </h2>
          <p className="text-white text-lg max-w-lg leading-relaxed drop-shadow-md">
            Your account security matters. Update your password safely and continue enjoying premium organic products.
          </p>
        </div>
      </div>

      {/* ================= SUCCESS / ERROR MODAL ================= */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-8 text-center">

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
              onClick={() => {
                if (modal.type === "success") {
                  navigate("/login");
                }
                setModal({ type: null, message: "" });
              }}
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