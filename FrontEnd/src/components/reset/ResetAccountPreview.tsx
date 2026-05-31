import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { ArrowLeft } from "lucide-react";
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

export default function ResetAccountPreview({
  user,
  onBack,
  error,
}: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState<"PREVIEW" | "OTP">("PREVIEW");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [localError, setError] = useState("");
  const [modal, setModal] = useState<{ type: string | null; message: string }>({
    type: null,
    message: "",
  });

  const validatePassword = (pwd: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pwd);

  /* ================= SEND OTP ================= */

  const handleSendOTP = async () => {
    setError("");

    if (!validatePassword(newPassword)) {
      setError(t("passwordRules"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    try {
      const res = await requestPasswordResetOTP(user.email);

      if (res?.success === false) {
        setError(res.message || "Failed to send OTP");
        return;
      }

      setStep("OTP");
      setSuccess(t("otpSent"));
    } catch {
      setError("Failed to send OTP.");
    }
  };

  /* ================= VERIFY OTP + RESET ================= */

  const handleVerifyAndReset = async () => {
    try {
      const verifyRes = await verifyPasswordResetOTP(user.email, otp);

      if (verifyRes?.success === false) {
        setModal({
          type: "error",
          message: verifyRes.message || "Invalid or expired OTP",
        });
        return;
      }

      const resetRes = await resetPassword(user.email, newPassword);

      if (resetRes?.success === false) {
        setModal({
          type: "error",
          message: resetRes.message || "Password reset failed",
        });
        return;
      }

      setModal({
        type: "success",
        message: t("passwordResetSuccess"),
      });
    } catch {
      setModal({
        type: "error",
        message: "OTP verification failed",
      });
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] mb-4 w-fit"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-xl font-semibold text-[#1e3a5f] mb-6">
          {t("accountPreview")}
        </h2>

        {/* ================= USER INFO ================= */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium">{t("firstName")} :</label>
            <input
              value={user.firstName}
              disabled
              className="w-full border px-4 py-2 rounded bg-gray-100 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("lastName")} :</label>
            <input
              value={user.lastName}
              disabled
              className="w-full border px-4 py-2 rounded bg-gray-100 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("emailAddress")} :</label>
            <input
              value={user.email}
              disabled
              className="w-full border px-4 py-2 rounded bg-gray-100 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("phoneNumber")} :</label>
            <input
              value={user.mobile}
              disabled
              className="w-full border px-4 py-2 rounded bg-gray-100 mt-1"
            />
          </div>
        </div>

        {(localError || error) && (
          <p className="text-red-600 mb-4">{localError || error}</p>
        )}

        {/* ================= PASSWORD STEP ================= */}
        {step === "PREVIEW" && (
          <>
            <div className="mb-4">
              <label className="text-sm font-medium">
                {t("newPassword")} :
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded mt-1"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium">
                {t("confirmPassword")} :
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded mt-1"
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
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        {/* ================= OTP STEP ================= */}
        {step === "OTP" && (
          <>
            <div className="max-w-sm mb-5">
              <label className="text-sm font-medium">
                {t("enterOtp")}
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-md px-4 py-2 mt-1"
              />
            </div>

            <button
              onClick={handleVerifyAndReset}
              className="w-full max-w-sm bg-[#1e3a5f] text-white py-3 rounded-lg font-semibold hover:bg-[#2a4a7c] transition"
            >
              {t("reset")}
            </button>
          </>
        )}
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
    </>
  );
}