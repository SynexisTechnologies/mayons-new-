import { useState } from "react";
import { submitContactToAdmin } from "../../services/ContactServices";
import { useLanguage } from "../../context/LanguageContext";
import ContactMap from "./ContactMap";
import { Send, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+94", name: "Sri Lanka", len: 9 },
  { code: "+1",  name: "USA",       len: 10 },
  { code: "+44", name: "UK",        len: 10 },
  { code: "+91", name: "India",     len: 10 },
  { code: "+61", name: "Australia", len: 9 },
];

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition";

export default function ContactForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", countryCode: "+94", phone: "", subject: "", message: "" });
  const [modal, setModal] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPhone = () => {
    const cc = COUNTRY_CODES.find(c => c.code === form.countryCode);
    return !cc || form.phone.replace(/\D/g, "").length === cc.len;
  };

  const handleSubmit = async () => {
    setModal({ type: null, message: "" });
    if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      setModal({ type: "error", message: t("contactRequired") }); return;
    }
    if (!isValidEmail(form.email)) { setModal({ type: "error", message: t("contactInvalidEmail") }); return; }
    if (form.phone && !isValidPhone()) { setModal({ type: "error", message: t("contactInvalidPhone") }); return; }
    setLoading(true);
    try {
      await submitContactToAdmin({ ...form, phone: form.phone ? `${form.countryCode}${form.phone.replace(/\D/g, "")}` : "" });
      setModal({ type: "success", message: t("contactSuccess") });
      setForm({ name: "", email: "", countryCode: "+94", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setModal({ type: "error", message: err?.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/8 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#1e3a5f]">{t("contactFormTitle")}</h2>
          </div>
          <p className="text-slate-400 text-sm mb-7">{t("contactFormDesc")}</p>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{t("contactName1")}</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{t("contactEmail1")}</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value.toLowerCase() })} className={inputCls} placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{t("contactPhone")} <span className="text-slate-300 font-normal">(optional)</span></label>
              <div className="flex gap-2">
                <select value={form.countryCode} onChange={e => setForm({ ...form, countryCode: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#1e3a5f] bg-white">
                  {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                </select>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`${inputCls} flex-1`} placeholder="77 123 4567" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{t("contactSelectSubject")}</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={`${inputCls} bg-white cursor-pointer`}>
                <option value="">— Select a subject —</option>
                <option value="general">{t("contactSubjectGeneral")}</option>
                <option value="product">{t("contactSubjectProduct")}</option>
                <option value="order">{t("contactSubjectOrder")}</option>
                <option value="partnership">{t("contactSubjectPartnership")}</option>
                <option value="feedback">{t("contactSubjectFeedback")}</option>
                <option value="complaint">{t("contactSubjectComplaint")}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{t("contactMessage1")}</label>
              <textarea rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className={`${inputCls} resize-none`} placeholder="Tell us how we can help…" />
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#2a4a7c] disabled:opacity-60 transition shadow-sm cursor-pointer text-sm">
              <Send className="w-4 h-4" />
              {loading ? "Sending…" : t("contactSubmit")}
            </button>
          </div>
        </div>

        <ContactMap />
      </div>

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[320px] text-center animate-scaleIn">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${modal.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {modal.type === "success"
                ? <CheckCircle className="w-8 h-8 text-green-500" />
                : <AlertCircle className="w-8 h-8 text-red-500" />}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${modal.type === "success" ? "text-[#1e3a5f]" : "text-red-600"}`}>
              {modal.type === "success" ? "Message Sent!" : "Something went wrong"}
            </h3>
            <p className="text-slate-500 text-sm mb-6">{modal.message}</p>
            <button onClick={() => setModal({ type: null, message: "" })}
              className="w-full bg-[#1e3a5f] text-white py-2.5 rounded-xl font-semibold hover:bg-[#2a4a7c] transition cursor-pointer">
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
