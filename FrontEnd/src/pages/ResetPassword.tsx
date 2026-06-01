import { Leaf, Lock, ShieldCheck, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import ResetEmailForm from "../components/reset/ResetEmailForm";
import ResetAccountPreview from "../components/reset/ResetAccountPreview";
import { getResetUser } from "../api/AuthService";

const features = [
  { icon: ShieldCheck, text: "End-to-end encrypted reset flow" },
  { icon: KeyRound,    text: "OTP verified — no guessing" },
  { icon: Lock,        text: "Your account stays protected" },
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<"EMAIL" | "PREVIEW">("EMAIL");
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (email: string) => {
    setError("");
    try {
      const res = await getResetUser(email);
      if (!res) { setError("Unexpected response from server"); return; }
      if (res.message && !res.user && !res.email) { setError(res.message); return; }
      const userObj = res.user || (res.email ? res : null);
      if (!userObj) { setError(res.message || "User not found"); return; }
      setUserData(userObj);
      setStep("PREVIEW");
    } catch { setError("Something went wrong."); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ══ LEFT — image panel ══ */}
      <div className="hidden md:block relative overflow-hidden bg-[#1e3a5f]">
        <img
          src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80"
          alt="Security"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f]/90 to-[#2a4a7c]/70" />

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

        {/* Copy */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-5">
            <Lock className="w-3 h-3" /> Account Security
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Regain<br />access safely.
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-xs leading-relaxed">
            Reset your password securely. We verify your identity before making any changes.
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
      <div className="flex flex-col justify-center px-10 sm:px-16 lg:px-20 py-12 bg-white overflow-y-auto min-h-screen">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 md:hidden cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-[#d4af37]" />
          </div>
          <p className="font-extrabold text-[#1e3a5f] text-sm">Organi</p>
        </div>

        <div className="w-full">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {["Find account", "Reset password"].map((label, i) => {
              const done = (i === 0 && step === "PREVIEW") || false;
              const active = (i === 0 && step === "EMAIL") || (i === 1 && step === "PREVIEW");
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${done ? "bg-[#d4af37] text-[#1e3a5f]" : active ? "bg-[#1e3a5f] text-white" : "bg-slate-100 text-slate-400"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${active ? "text-[#1e3a5f]" : "text-slate-400"}`}>{label}</span>
                  {i === 0 && <div className="w-8 h-px bg-slate-200 mx-1" />}
                </div>
              );
            })}
          </div>

          {step === "EMAIL" && <ResetEmailForm onSubmit={handleEmailSubmit} error={error} />}
          {step === "PREVIEW" && userData && <ResetAccountPreview user={userData} onBack={() => setStep("EMAIL")} error={error} />}
        </div>
      </div>
    </div>
  );
}
