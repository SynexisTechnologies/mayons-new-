import { ArrowLeft, Leaf, User, ShoppingCart, Search, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { items } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { login, logout, user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetHighlight, setShowResetHighlight] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(value);
  };

  const handleLogin = async () => {
    setError("");
    setNotRegistered(false);
    if (!validateEmail(email)) {
      setError(t("invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setError(t("passwordShort"));
      return;
    }
    try {
      await login({ email: email.toLowerCase(), password });
      const role = JSON.parse(localStorage.getItem("user")!).role;
      if (role === "admin") navigate("/"); else navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message?.toLowerCase();
      if (message?.includes("not found")) {
        setError(t("emailNotRegistered"));
        setNotRegistered(true);
      } else if (message?.includes("invalid")) {
        setError(t("invalidCredentials"));
        setShowResetHighlight(true);
      } else {
        setError(t("invalidCredentials"));
        setShowResetHighlight(true);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[2fr_3fr] bg-white">

      {/* ================= TOP BAR ================= */}
      <div
        className={`w-full flex items-center justify-between px-4 py-3 fixed top-0 z-50 transition-shadow ${
          isScrolled ? "shadow-md" : ""
        }`}
        style={{ backgroundColor: "#1e3a5f", boxShadow: isScrolled ? "0 4px 6px #1e3a5f4d" : "none" }}
      >
        <div className="flex items-center gap-2 text-white">
          <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
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
            className="w-full rounded-full px-5 py-2 outline-none bg-[#2a4a7c]/20 text-white placeholder-white"
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
          {user ? (
            <div className="flex flex-col items-end mr-4 text-white">
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs">
                {user.role === "admin" ? "Admin" : "User"}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm mt-1 underline hover:text-[#d4af37]"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="text-white mr-4">
              <User />
            </button>
          )}

          <button
            className="relative text-white"
            onClick={() => alert("Cart clicked")}
          >
            <ShoppingCart />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center px-10 sm:px-16 pt-28">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] mb-4 w-fit"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-3xl font-bold mb-1">{t("loginTitle")}</h1>
        <h3 className="text-gray-700 mb-8">{t("loginSub")}</h3>

        {/* EMAIL */}
        <label className="text-sm font-medium mb-1">{t("emailLabel")}</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setNotRegistered(false);
          }}
          className="w-full max-w-sm border rounded-md px-4 py-2 mb-3 focus:ring-2 focus:ring-[#d4af37] outline-none"
          placeholder={t("emailLabel")}
        />

        {/* PASSWORD */}
        <label className="text-sm font-medium mb-1">{t("passwordLabel")}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setShowResetHighlight(false);
          }}
          className="w-full max-w-sm border rounded-md px-4 py-2 mb-3 focus:ring-2 focus:ring-[#d4af37] outline-none"
          placeholder={t("passwordLabel")}
        />

        {/* ERROR */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* BUTTONS + LINKS */}
        <div className="flex flex-col items-center w-full max-w-sm space-y-3 mt-4">

          {/* SIGN IN */}
          <button
            onClick={handleLogin}
            className="w-full max-w-sm bg-[#1e3a5f] text-white py-3 rounded-lg font-semibold hover:bg-[#2a4a7c] transition"
          >
            {t("signIn")}
          </button>

          {/* BACK */}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#d4af37] text-white py-3 rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> {t("backToHome")}
          </button>

          {/* LINKS */}
          <div className="text-sm text-center space-y-1">
            <p>
              {t("dontHaveAccount")}
              <button
                onClick={() => navigate("/signup")}
                className={`ml-1 ${
                  notRegistered
                    ? "text-red-600 animate-pulse underline"
                    : "text-blue-700 hover:underline"
                }`}
              >
                {t("signUp")}
              </button>
            </p>
            <p>
              {t("forgotPassword")}
              <button
                onClick={() => navigate("/reset-password")}
                className={`ml-1 ${
                  showResetHighlight
                    ? "text-red-600 animate-pulse underline"
                    : "text-blue-700 hover:underline"
                }`}
              >
                {t("reset")}
              </button>
            </p>
          </div>
        </div>

        {/* OR */}
        <div className="my-6 flex items-center max-w-sm">
          <div className="flex-grow h-px bg-[#1e3a5f]/40" />
          <span className="px-3 text-gray-600 text-sm">OR</span>
          <div className="flex-grow h-px bg-[#1e3a5f]/40" />
        </div>

        {/* SOCIAL LOGIN */}
        <div className="flex gap-4 max-w-sm">
          <button
            onClick={() => alert("Google OAuth")}
            className="flex-1 border py-3 rounded-md hover:bg-gray-100 flex justify-center items-center"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
          </button>
          <button
            onClick={() => alert("Facebook OAuth")}
            className="flex-1 border py-3 rounded-md hover:bg-gray-100 flex justify-center items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
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

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-[340px] text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Login Successful!
            </h3>

            <p className="text-gray-600 mb-6">{t("loginSuccess")}</p>

            <button
              onClick={() => {
                setShowSuccess(false);
                const role = user?.role;
                if (role === "admin") navigate("/admin");
                else navigate("/");
              }}
              className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-[#2a4a7c] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
