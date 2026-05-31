import { useState } from "react";
import { ArrowLeft, Truck, CheckCircle, AlertCircle } from "lucide-react";
import type { CartItem } from "../context/CartContext";
import { placeOrder } from "../services/CheckoutServices";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  items: CartItem[];
  onBack: () => void;
}
interface CheckoutFormData {
  name: string;
  phone: string;
  sendAlerts: boolean;
  address: string;
  city: string;
  locationType: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  deliveryInstructions: string;
}


export default function CheckoutPage({ items, onBack }: Props) {
  const { t } = useLanguage();

  const DELIVERY_FEE = 300.0;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + DELIVERY_FEE;

  const [formData, setFormData] = useState<CheckoutFormData>({

    name: "",
    phone: "",
    sendAlerts: false,
    address: "",
    city: "",
    locationType: "",
    deliveryDate: "",
    deliveryTimeSlot: "", // ✅ changed to array
    deliveryInstructions: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderStatus, setOrderStatus] = useState<"success" | "error" | null>(null);
  const [orderMessage, setOrderMessage] = useState("");

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const { name, value, type } = e.target;
  const checked =
    e.target instanceof HTMLInputElement ? e.target.checked : false;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });

  setErrors({ ...errors, [name]: "" });
};


  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = t("Required");
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = t("ValidPhone");
    if (!formData.address) newErrors.address = t("Required");
    if (!formData.city) newErrors.city = t("Required");
    if (!formData.locationType) newErrors.locationType = t("Required");
    if (!formData.deliveryDate) newErrors.deliveryDate = t("Required");
    if (formData.deliveryTimeSlot.length === 0)
      newErrors.deliveryTimeSlot = t("Required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const orderPayload = {
      addressId: formData.address, 
      paymentMethod: "CASH_ON_DELIVERY",
      deliveryType: "HOME_DELIVERY",
      expectedDate: formData.deliveryDate,
    };

    await placeOrder(orderPayload);
    setOrderStatus("success");
    setOrderMessage(t("Order_Success"));
  } catch (error: any) {
    setOrderStatus("error");
    setOrderMessage(error?.message || error?.response?.data?.message || "Order failed");
  }
};

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-10">
      {/* Order Status Modal */}
      {orderStatus && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[320px] text-center animate-scaleIn">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${orderStatus === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {orderStatus === "success"
                ? <CheckCircle className="w-8 h-8 text-green-500" />
                : <AlertCircle className="w-8 h-8 text-red-500" />}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${orderStatus === "success" ? "text-[#1e3a5f]" : "text-red-600"}`}>
              {orderStatus === "success" ? "Order Placed!" : "Order Failed"}
            </h3>
            <p className="text-slate-500 text-sm mb-6">{orderMessage}</p>
            <button onClick={() => setOrderStatus(null)}
              className="w-full bg-[#1e3a5f] text-white py-2.5 rounded-xl font-semibold hover:bg-[#2a4a7c] transition">
              OK
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e3a5f] mb-6"
        >
          <ArrowLeft size={18} />
          {t("Continue_shopping")}
        </button>

        <h1 className="text-3xl font-bold mb-8 text-[#1e3a5f]">
          {t("Checkout")}
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="text-[#d4af37]" />
                <h2 className="text-xl font-bold text-[#1e3a5f]">
                  {t("Recipientinfo")}
                </h2>
              </div>

              <div className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("Name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-4 py-3 rounded-lg"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("PhoneNo")}<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border px-4 py-3 rounded-lg"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">{errors.phone}</p>
                  )}
                </div>

                {/* Send Alerts */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="sendAlerts"
                    checked={formData.sendAlerts}
                    onChange={handleChange}
                  />
                  <label className="text-sm">
                    {t("Send_Order_Alerts")}
                  </label>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("Delivery_Add")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border px-4 py-3 rounded-lg"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs">{errors.address}</p>
                  )}
                </div>

                {/* City & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t("City")}
                    className="border px-4 py-3 rounded-lg w-full"
                  />

                  <select
                    name="locationType"
                    value={formData.locationType}
                    onChange={handleChange}
                    className="border px-4 py-3 rounded-lg w-full"
                  >
                    <option value="">{t("Select_Option")}</option>
                    <option value="home">{t("home1")}</option>
                    <option value="office">{t("office")}</option>
                    <option value="other">{t("other")}</option>
                  </select>
                </div>

                {/* Delivery Date */}
                <div>
                  <label>{t("Delivery_Date")} <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className="w-full border px-4 py-3 rounded-lg"
                  />
                </div>

<div>
  <label className="block mb-2 font-medium">
    {t("Delivery_Time")} <span className="text-red-500">*</span>
  </label>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[
      "8:00 AM - 5:00 PM",
      "9:00 AM - 12:00 PM",
      "12:00 PM - 3:00 PM",
      "3:00 PM - 6:00 PM",
    ].map((slot) => (
      <button
        type="button"
        key={slot}
        onClick={() =>
          setFormData({ ...formData, deliveryTimeSlot: slot })
        }
        className={`border rounded-lg py-3 px-4 text-sm transition
          ${
            formData.deliveryTimeSlot === slot
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-300 hover:border-green-400"
          }
        `}
      >
        ⏰ {slot}
      </button>
    ))}
  </div>

  {errors.deliveryTimeSlot && (
    <p className="text-red-500 text-xs mt-2">
      {errors.deliveryTimeSlot}
    </p>
  )}
</div>

                {/* Delivery Instructions */}
                <div>
                  <label>{t("Delivery_Instructions")}</label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border px-4 py-3 rounded-lg"
                  />
                  <p className="text-red-500 text-xs">
                    {t("No_Special_Time_Request")}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-xl p-6 shadow-md sticky top-32">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
              {t("Order_Summary")}
            </h2>

            <div className="space-y-4 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  
                  {/* Image + Name */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={(item as any).nameEn || (item as any).nameSi || item.nameKey}
                      className="w-14 h-14 object-cover rounded-lg border"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/placeholder.png")
                      }
                    />
                    <div>
                      <p className="font-medium">
                        {(item as any).nameEn || (item as any).nameSi || item.nameKey}
                      </p>
                      <p className="text-xs text-gray-500">
                        × {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <span className="font-semibold">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>{t("Subtotal")}</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("Delivery_Fee")}</span>
                <span>Rs {DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#1e3a5f]">
                <span>{t("Tot")}</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {t("Statement")}
            </p>

            <button
              type="submit"
              className="w-full bg-[#1e3a5f] text-white py-3 rounded-full mt-6 hover:opacity-90"
            >
              {t("Place_Order")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
