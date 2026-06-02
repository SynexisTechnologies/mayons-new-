import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
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

  return (
    <div className="w-full">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-evergreen mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="w-11 h-11 bg-mist rounded-2xl flex items-center justify-center mb-5">
        <Mail className="w-5 h-5 text-evergreen" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">{t("resetTitle")}</h1>
      <p className="text-stone-400 text-sm mb-6">{t("resetDesc")}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(email.trim().toLowerCase());
        }}
        className="space-y-4"
      >
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-evergreen focus:ring-4 focus:ring-evergreen/10 focus:bg-white transition"
          />
        </div>

        {error && <p className="text-clay text-xs bg-clay-soft px-3 py-2 rounded-lg">{error}</p>}

        <button type="submit" className="btn btn-primary w-full py-3">
          {t("continue")}
        </button>
      </form>

      <button
        onClick={() => navigate("/login")}
        className="flex items-center justify-center gap-1.5 text-sm text-stone-400 hover:text-evergreen mt-5 w-full transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t("backToLogin")}
      </button>
    </div>
  );
}
