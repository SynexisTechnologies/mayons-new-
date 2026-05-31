import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface Props {
  onSubmit: (email: string) => void;
  error?: string;
}

export default function ResetEmailForm({ onSubmit, error }: Props) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSubmit(email.trim().toLowerCase());
  };

  return (
    <div className="w-full max-w-md">
           <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] mb-4 w-fit"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-semibold text-[#1e3a5f] mb-4">
                  {t("resetTitle")}
                </h1>
        
                <p className="text-sm text-gray-600 mb-4">
                  {t("resetDesc")}
                </p>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md border"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-[#d4af37] outline-none"
            placeholder={t("emailPlaceholder")}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-[#1e3a5f] text-white py-2 rounded-md hover:bg-[#2a4a7c]"
        >
          {t("continue")}
        </button>
      </form>

      <button
        onClick={() => navigate("/login")}
        className="flex items-center justify-center gap-2 text-[#2a4a7c] mt-4 w-full"
      >
        <ArrowLeft size={18} /> {t("backToLogin")}
      </button>
    </div>
  );
}