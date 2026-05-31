import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Tag,
  UserCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
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

export default function EventRegistrationModal({
  selectedEvent,
  setSelectedEvent,
}: Props) {
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" />

      {/* ================= Registration Modal ================= */}
      {!showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {t("language") === "si"
                  ? selectedEvent.titleSi
                  : selectedEvent.title}
              </h2>
              <button onClick={() => setSelectedEvent(null)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              <form onSubmit={handleRegistration} className="space-y-8">

                {/* ===== Form Title ===== */}
                <div className="text-center">
                  <h1 className="text-xl font-semibold text-gray-800">
                    Event Registration Form
                  </h1>
                  <div className="w-16 h-[2px] bg-[#d4af37] mx-auto mt-2 rounded-full" />
                </div>

                {/* ===== Form Fields ===== */}
                <div className="space-y-6">

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      {t("fullName")} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border rounded-lg px-4 py-3">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border rounded-lg px-4 py-3">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      {t("phone")} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border rounded-lg px-4 py-3">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Tickets */}
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      {t("numberOfTickets")}
                    </label>
                    <div className="flex items-center border rounded-lg px-4 py-3">
                      <Tag className="w-5 h-5 text-gray-400 mr-3" />
                      <select
                        name="numberOfTickets"
                        value={formData.numberOfTickets}
                        onChange={handleInputChange}
                        className="w-full outline-none bg-transparent"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Ticket{n > 1 && "s"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      {t("dietaryPreferences")}
                    </label>
                    <div className="flex items-center border rounded-lg px-4 py-3">
                      <UserCircle className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type="text"
                        name="dietaryPreferences"
                        value={formData.dietaryPreferences}
                        onChange={handleInputChange}
                        className="w-full outline-none"
                      />
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      {t("specialRequirements")}
                    </label>
                    <div className="flex items-start border rounded-lg px-4 py-3">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleInputChange}
                        className="w-full outline-none resize-none h-24"
                      />
                    </div>
                  </div>

                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-[#1e3a5f] text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-[#2a4a7c] transition"
>
                    {t("registerEvent")}
                    <ArrowRight size={18} />
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= Success Modal ================= */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_#1e3a5f4d] shadow-2xl p-10 w-[340px] text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Success!
            </h3>
            <p className="text-gray-600 mb-6">
              {t("registrationSuccess")}
            </p>
            <button
              onClick={closeAll}
               className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-[#2a4a7c]"
>              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
