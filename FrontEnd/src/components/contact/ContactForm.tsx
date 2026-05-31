import { useState } from "react";
import { submitContactToAdmin } from "../../services/ContactServices";
import { useLanguage } from "../../context/LanguageContext";
import ContactMap from "./ContactMap";
import { Send, MessageCircle } from "lucide-react";

const countryCodes = [
  { code: "+1", name: "USA", minLength: 10, maxLength: 10 },
  { code: "+44", name: "UK", minLength: 10, maxLength: 10 },
  { code: "+94", name: "Sri Lanka", minLength: 9, maxLength: 9 },
  { code: "+91", name: "India", minLength: 10, maxLength: 10 },
  { code: "+61", name: "Australia", minLength: 9, maxLength: 9 },
];

export default function ContactForm() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+94",
    phone: "",
    subject: "",
    message: "",
  });

const [modal, setModal] = useState<{
  type: "success" | "error" | null;
  message: string;
}>({
  type: null,
  message: "",
});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = () => {
    const country = countryCodes.find((c) => c.code === form.countryCode);
    if (!country) return false;
    const phoneDigits = form.phone.replace(/\D/g, "");
    return (
      phoneDigits.length >= country.minLength &&
      phoneDigits.length <= country.maxLength
    );
  };

const handleSubmit = async () => {
  setModal({ type: null, message: "" });

  if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
    setModal({ type: "error", message: t("contactRequired") });
    return;
  }

  if (!validateEmail(form.email)) {
    setModal({ type: "error", message: t("contactInvalidEmail") });
    return;
  }

  if (form.phone && !validatePhone()) {
    setModal({ type: "error", message: t("contactInvalidPhone") });
    return;
  }

  try {
    setIsLoading(true);

    await submitContactToAdmin({
      ...form,
      phone: form.phone
        ? `${form.countryCode}${form.phone.replace(/\D/g, "")}`
        : "",
    });

    setModal({
      type: "success",
      message: t("contactSuccess"),
    });

    setForm({
      name: "",
      email: "",
      countryCode: "+94",
      phone: "",
      subject: "",
      message: "",
    });

  } catch (err: any) {
    setModal({
      type: "error",
      message: err?.response?.data?.message || "Something went wrong",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="w-8 h-8 text-[#1e3a5f]" />
            <h2 className="text-3xl font-bold text-[#2a4a7c]">
              {t("contactFormTitle")}
            </h2>
          </div>

          <p className="text-gray-600 mb-6">{t("contactFormDesc")}</p>
          <div className="space-y-6">
            <input
              type="text"
              placeholder={t("contactName1")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
            />

            <input
              type="email"
              placeholder={t("contactEmail1")}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value.toLowerCase() })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
            />

            <div className="flex gap-2">
              <select
                value={form.countryCode}
                onChange={(e) =>
                  setForm({ ...form, countryCode: e.target.value })
                }
                className="px-3 py-3 border border-gray-300 rounded-lg"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder={t("contactPhone")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <select
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">{t("contactSelectSubject")}</option>
              <option value="general">{t("contactSubjectGeneral")}</option>
              <option value="product">{t("contactSubjectProduct")}</option>
              <option value="order">{t("contactSubjectOrder")}</option>
              <option value="partnership">{t("contactSubjectPartnership")}</option>
              <option value="feedback">{t("contactSubjectFeedback")}</option>
              <option value="complaint">{t("contactSubjectComplaint")}</option>
            </select>

            <textarea
              rows={5}
              placeholder={t("contactMessage1")}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#2a4a7c] text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-[#1e3a5f] disabled:opacity-60"
            >
              <Send size={18} />
              {isLoading ? "Sending..." : t("contactSubmit")}
            </button>
          </div>
        </div>

        <ContactMap />
      </div>
      {/* ================= Feedback Modal ================= */}
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
    </section>
  );
}