import React, { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface Props { onSubmit: (email: string) => void; error?: string; }

export default function ResetEmailForm({ onSubmit, error }: Props) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1e3a5f] mb-6 transition cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="w-10 h-10 bg-[#1e3a5f]/8 rounded-xl flex items-center justify-center mb-5">
        <Mail className="w-5 h-5 text-[#d4af37]" />
      </div>
      <h1 className="text-xl font-extrabold text-[#1e3a5f] mb-1">{t("resetTitle")}</h1>
      <p className="text-slate-400 text-sm mb-6">{t("resetDesc")}</p>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(email.trim().toLowerCase()); }} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{t("emailLabel")}</label>
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition"
          />
        </div>

        {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button type="submit" className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-bold hover:bg-[#2a4a7c] transition cursor-pointer text-sm shadow-sm">
          {t("continue")}
        </button>
      </form>

      <button onClick={() => navigate("/login")}
        className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-[#1e3a5f] mt-5 w-full transition cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> {t("backToLogin")}
      </button>
    </div>
  );
}
