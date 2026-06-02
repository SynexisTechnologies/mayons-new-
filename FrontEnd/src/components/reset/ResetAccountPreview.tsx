import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  requestPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword,
} from "../../api/AuthService";

interface Props {
  user: any;
  onBack: () => void;
  error?: string;
}

const inputCls =
  "w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-evergreen focus:ring-4 focus:ring-evergreen/10 focus:bg-white transition";
const disabledCls = "bg-stone-100 text-stone-400 cursor-not-allowed";

export default function ResetAccountPreview({ user, onBack, error }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<"PREVIEW" | "OTP">("PREVIEW");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const validatePassword = (p: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(p);

  const handleSendOTP = async () => {
    setLocalError("");
    if (!validatePassword(newPw)) {
      setLocalError(t("passwordRules"));
      return;
    }
    if (newPw !== confirmPw) {
      setLocalError(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordResetOTP(user.email);
      if (res?.success === false) {
        setLocalError(res.message || "Failed to send OTP");
        return;
      }
      setStep("OTP");
      setSuccess(t("otpSent"));
    } catch {
      setLocalError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async () => {
    setLoading(true);
    try {
      const verifyRes = await verifyPasswordResetOTP(user.email, otp);
      if (verifyRes?.success === false) {
        setModal({ type: "error", message: verifyRes.message || "Invalid OTP" });
        return;
      }
      const resetRes = await resetPassword(user.email, newPw);
      if (resetRes?.success === false) {
        setModal({ type: "error", message: resetRes.message || "Reset failed" });
        return;
      }
      setModal({ type: "success", message: t("passwordResetSuccess") });
    } catch {
      setModal({ type: "error", message: "OTP verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const labelCls = "text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block";

  return (
    <>
      <div className="w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-evergreen mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="font-display text-2xl font-semibold text-ink mb-1.5">{t("accountPreview")}</h2>
        <p className="text-stone-400 text-sm mb-6">Confirm your details and set a new password.</p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: t("firstName"), value: user.firstName },
            { label: t("lastName"), value: user.lastName },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1 block">
                {label}
              </label>
              <input value={value} disabled className={`${inputCls} ${disabledCls}`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: t("emailAddress"), value: user.email },
            { label: t("phoneNumber"), value: user.mobile },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1 block">
                {label}
              </label>
              <input value={value} disabled className={`${inputCls} ${disabledCls}`} />
            </div>
          ))}
        </div>

        {(localError || error) && (
          <p className="text-clay text-xs bg-clay-soft px-3 py-2 rounded-lg mb-4">
            {localError || error}
          </p>
        )}
        {success && step === "OTP" && (
          <p className="text-pine text-xs bg-pine/10 px-3 py-2 rounded-lg mb-4">{success}</p>
        )}

        {step === "PREVIEW" && (
          <div className="space-y-3 mt-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t("newPassword")}</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className={`${inputCls} pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
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
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className={`${inputCls} pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="btn btn-primary w-full py-3 mt-2 disabled:opacity-60"
            >
              {loading ? "Sending OTP…" : t("sendOtp")}
            </button>
          </div>
        )}

        {step === "OTP" && (
          <div className="space-y-4 mt-5">
            <div>
              <label className={labelCls}>{t("enterOtp")}</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="000000"
                className={`${inputCls} text-center tracking-[0.4em] font-bold text-evergreen text-lg`}
              />
              <p className="text-xs text-stone-400 mt-1">Check your email for the 6-digit code.</p>
            </div>
            <button
              onClick={handleVerifyAndReset}
              disabled={loading}
              className="btn btn-primary w-full py-3 disabled:opacity-60"
            >
              {loading ? "Verifying…" : t("reset")}
            </button>
            <button
              onClick={() => {
                setStep("PREVIEW");
                setLocalError("");
                setSuccess("");
              }}
              className="w-full text-sm text-stone-400 hover:text-evergreen transition py-1"
            >
              ← Change password
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[320px] text-center animate-scaleIn">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                modal.type === "success" ? "bg-pine/10" : "bg-clay-soft"
              }`}
            >
              {modal.type === "success" ? (
                <CheckCircle className="w-8 h-8 text-pine" />
              ) : (
                <AlertCircle className="w-8 h-8 text-clay" />
              )}
            </div>
            <h3
              className={`font-display text-2xl font-semibold mb-2 ${
                modal.type === "success" ? "text-ink" : "text-clay"
              }`}
            >
              {modal.type === "success" ? "Password Reset!" : "Error"}
            </h3>
            <p className="text-stone-500 text-sm mb-6">{modal.message}</p>
            <button
              onClick={() => {
                if (modal.type === "success") navigate("/login");
                setModal({ type: null, message: "" });
              }}
              className="btn btn-primary w-full py-2.5"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
