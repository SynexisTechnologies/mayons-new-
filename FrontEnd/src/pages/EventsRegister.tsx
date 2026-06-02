import { useState } from "react";
import { X, User, Mail, Phone, Tag, UserCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface Event {
  id: number;
  title: string;
  titleSi: string;
}

interface Props {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
}

export default function EventRegistrationModal({ selectedEvent, setSelectedEvent }: Props) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    numberOfTickets: "1",
    dietaryPreferences: "",
    specialRequirements: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;
    setShowSuccess(true);
  };

  const closeAll = () => {
    setShowSuccess(false);
    setSelectedEvent(null);
  };

  if (!selectedEvent) return null;

  const fieldWrap =
    "flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus-within:border-evergreen focus-within:bg-white transition";

  return (
    <>
      <div className="fixed inset-0 bg-ink/50 backdrop-blur-md z-40" onClick={() => setSelectedEvent(null)} />

      {/* Registration Modal */}
      {!showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div className="bg-canvas rounded-3xl shadow-2xl w-full max-w-2xl animate-scaleIn">
            <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200">
              <h2 className="font-display text-xl font-semibold text-ink">
                {t("language") === "si" ? selectedEvent.titleSi : selectedEvent.title}
              </h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              <form onSubmit={handleRegistration} className="space-y-7">
                <div className="text-center">
                  <h1 className="font-display text-2xl font-semibold text-ink">
                    Event Registration
                  </h1>
                  <div className="w-16 h-[3px] bg-honey mx-auto mt-2 rounded-full" />
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block font-medium text-ink text-sm">
                      {t("fullName")} <span className="text-clay">*</span>
                    </label>
                    <div className={fieldWrap}>
                      <User className="w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full outline-none bg-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-medium text-ink text-sm">
                      {t("email")} <span className="text-clay">*</span>
                    </label>
                    <div className={fieldWrap}>
                      <Mail className="w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full outline-none bg-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-medium text-ink text-sm">
                      {t("phone")} <span className="text-clay">*</span>
                    </label>
                    <div className={fieldWrap}>
                      <Phone className="w-5 h-5 text-stone-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full outline-none bg-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-medium text-ink text-sm">{t("numberOfTickets")}</label>
                    <div className={fieldWrap}>
                      <Tag className="w-5 h-5 text-stone-400" />
                      <select
                        name="numberOfTickets"
                        value={formData.numberOfTickets}
                        onChange={handleInputChange}
                        className="w-full outline-none bg-transparent text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Ticket{n > 1 && "s"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-medium text-ink text-sm">{t("dietaryPreferences")}</label>
                    <div className={fieldWrap}>
                      <UserCircle className="w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="dietaryPreferences"
                        value={formData.dietaryPreferences}
                        onChange={handleInputChange}
                        className="w-full outline-none bg-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-medium text-ink text-sm">{t("specialRequirements")}</label>
                    <div className={`${fieldWrap} items-start`}>
                      <CheckCircle className="w-5 h-5 text-stone-400 mt-1" />
                      <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleInputChange}
                        className="w-full outline-none bg-transparent resize-none h-24 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="btn btn-primary">
                    {t("registerEvent")} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-[340px] text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="bg-pine/10 rounded-full p-4">
                <CheckCircle className="w-10 h-10 text-pine" />
              </div>
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-2">Success!</h3>
            <p className="text-stone-500 mb-6 text-sm">{t("registrationSuccess")}</p>
            <button onClick={closeAll} className="btn btn-primary w-full py-2.5">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
