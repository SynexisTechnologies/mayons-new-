import { Lock, ShieldCheck, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import ResetEmailForm from "../components/reset/ResetEmailForm";
import ResetAccountPreview from "../components/reset/ResetAccountPreview";
import { getResetUser } from "../api/AuthService";
import Logo from "../components/Logo";

const features = [
  { icon: ShieldCheck, text: "End-to-end encrypted reset flow" },
  { icon: KeyRound, text: "OTP verified — no guessing" },
  { icon: Lock, text: "Your account stays protected" },
];

export default function ResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"EMAIL" | "PREVIEW">("EMAIL");
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (email: string) => {
    setError("");
    try {
      const res = await getResetUser(email);
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

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-canvas">
      {/* LEFT — image panel */}
      <div className="hidden md:block relative overflow-hidden bg-evergreen">
        <img
          src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80"
          alt="Security"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-evergreen via-evergreen/90 to-forest/70" />

        <div className="absolute top-8 left-8 cursor-pointer" onClick={() => navigate("/")}>
          <Logo height={56} width={150} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <p className="eyebrow text-honey-light mb-5">
            <Lock className="w-3 h-3" /> Account Security
          </p>
          <h2 className="font-display text-5xl font-semibold mb-4 leading-[1.05]">
            Regain
            <br />
            access safely.
          </h2>
          <p className="text-white/55 text-sm mb-8 max-w-xs leading-relaxed">
            Reset your password securely. We verify your identity before making any changes.
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
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {["Find account", "Reset password"].map((label, i) => {
              const done = i === 0 && step === "PREVIEW";
              const active =
                (i === 0 && step === "EMAIL") || (i === 1 && step === "PREVIEW");
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                      done
                        ? "bg-honey text-white"
                        : active
                        ? "bg-evergreen text-white"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-evergreen" : "text-stone-400"
                    }`}
                  >
                    {label}
                  </span>
                  {i === 0 && <div className="w-8 h-px bg-stone-200 mx-1" />}
                </div>
              );
            })}
          </div>

          {step === "EMAIL" && <ResetEmailForm onSubmit={handleEmailSubmit} error={error} />}
          {step === "PREVIEW" && userData && (
            <ResetAccountPreview user={userData} onBack={() => setStep("EMAIL")} error={error} />
          )}
        </div>
      </div>
    </div>
  );
}
