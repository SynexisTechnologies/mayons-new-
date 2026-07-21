import { useState } from "react";
import { ArrowLeft, Truck, CheckCircle, AlertCircle, Clock } from "lucide-react";
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
  senderName: string;
}

const inputCls =
  "w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-evergreen focus:ring-4 focus:ring-evergreen/10 focus:bg-white transition";
const labelCls = "block text-sm font-medium text-ink mb-1.5";

export default function CheckoutPage({ items, onBack }: Props) {
  const { t } = useLanguage();

  const DELIVERY_FEE = 300.0;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    sendAlerts: false,
    address: "",
    city: "",
    locationType: "",
    deliveryDate: "",
    deliveryTimeSlot: "",
    deliveryInstructions: "",
    senderName: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderStatus, setOrderStatus] = useState<"success" | "error" | null>(null);
  const [orderMessage, setOrderMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = t("Required");
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = t("ValidPhone");
    if (!formData.address) newErrors.address = t("Required");
    if (!formData.city) newErrors.city = t("Required");
    if (!formData.locationType) newErrors.locationType = t("Required");
    if (!formData.deliveryDate) newErrors.deliveryDate = t("Required");
    if (formData.deliveryTimeSlot.length === 0) newErrors.deliveryTimeSlot = t("Required");
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
        deliveryFee: DELIVERY_FEE,
        // Everything the recipient section collects — previously dropped on submit
        recipient: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          locationType: formData.locationType,
          deliveryDate: formData.deliveryDate,
          deliveryTimeSlot: formData.deliveryTimeSlot,
          deliveryInstructions: formData.deliveryInstructions,
          senderName: formData.senderName,
          sendAlerts: formData.sendAlerts,
        },
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
    <div className="min-h-screen bg-canvas pt-[150px] md:pt-[170px] pb-16">
      {/* Order Status Modal */}
      {orderStatus && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[320px] text-center animate-scaleIn">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                orderStatus === "success" ? "bg-pine/10" : "bg-clay-soft"
              }`}
            >
              {orderStatus === "success" ? (
                <CheckCircle className="w-8 h-8 text-pine" />
              ) : (
                <AlertCircle className="w-8 h-8 text-clay" />
              )}
            </div>
            <h3
              className={`font-display text-2xl font-semibold mb-2 ${
                orderStatus === "success" ? "text-ink" : "text-clay"
              }`}
            >
              {orderStatus === "success" ? "Order Placed!" : "Order Failed"}
            </h3>
            <p className="text-stone-500 text-sm mb-6">{orderMessage}</p>
            <button onClick={() => setOrderStatus(null)} className="btn btn-primary w-full py-2.5">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-evergreen mb-6 transition text-sm"
        >
          <ArrowLeft size={18} />
          {t("Continue_shopping")}
        </button>

        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8 text-ink">
          {t("Checkout")}
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipient Information */}
            <div className="card p-7">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-mist flex items-center justify-center">
                  <Truck className="w-5 h-5 text-evergreen" />
                </div>
                <h2 className="font-display text-xl font-semibold text-ink">{t("Recipientinfo")}</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      {t("Name")} <span className="text-clay">*</span>
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} />
                    {errors.name && <p className="text-clay text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>
                      {t("PhoneNo")} <span className="text-clay">*</span>
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} />
                    {errors.phone && <p className="text-clay text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sendAlerts"
                    checked={formData.sendAlerts}
                    onChange={handleChange}
                    className="w-4 h-4 accent-evergreen"
                  />
                  <span className="text-sm text-stone-600">{t("Send_Order_Alerts")}</span>
                </label>
              </div>
            </div>

            {/* Address Details */}
            <div className="card p-7">
              <h2 className="font-display text-xl font-semibold text-ink mb-6">{t("Address_Details")}</h2>

              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    {t("Delivery_Add")} <span className="text-clay">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className={inputCls}
                  />
                  {errors.address && <p className="text-clay text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      {t("City")} <span className="text-clay">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t("City")}
                      className={inputCls}
                    />
                    {errors.city && <p className="text-clay text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>
                      {t("Location_Type")} <span className="text-clay">*</span>
                    </label>
                    <select name="locationType" value={formData.locationType} onChange={handleChange} className={inputCls}>
                      <option value="">{t("Select_Option")}</option>
                      <option value="house">{t("house")}</option>
                      <option value="apartment">{t("apartment")}</option>
                      <option value="office">{t("office")}</option>
                      <option value="hospital">{t("hospital")}</option>
                      <option value="school">{t("school")}</option>
                      <option value="funeralHome">{t("funeralHome")}</option>
                      <option value="weddingReception">{t("weddingReception")}</option>
                      <option value="other">{t("other")}</option>
                    </select>
                    {errors.locationType && <p className="text-clay text-xs mt-1">{errors.locationType}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    {t("Delivery_Date")} <span className="text-clay">*</span>
                  </label>
                  <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className={inputCls} />
                  {errors.deliveryDate && <p className="text-clay text-xs mt-1">{errors.deliveryDate}</p>}
                </div>

                <div>
                  <label className={labelCls}>
                    {t("Delivery_Time")} <span className="text-clay">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["8:00 AM - 5:00 PM", "9:00 AM - 12:00 PM", "12:00 PM - 3:00 PM", "3:00 PM - 6:00 PM"].map(
                      (slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setFormData({ ...formData, deliveryTimeSlot: slot })}
                          className={`flex items-center gap-2 border rounded-xl py-3 px-4 text-sm font-medium transition ${
                            formData.deliveryTimeSlot === slot
                              ? "border-evergreen bg-mist/60 text-evergreen"
                              : "border-stone-200 text-stone-600 hover:border-evergreen/40"
                          }`}
                        >
                          <Clock className="w-4 h-4" /> {slot}
                        </button>
                      )
                    )}
                  </div>
                  {errors.deliveryTimeSlot && (
                    <p className="text-clay text-xs mt-2">{errors.deliveryTimeSlot}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>{t("Delivery_Instructions")}</label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    rows={3}
                    className={inputCls}
                  />
                  <p className="text-clay/80 text-xs mt-1">{t("No_Special_Time_Request")}</p>
                </div>

                <div>
                  <label className={labelCls}>{t("Sender_Name")}</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    placeholder={t("Your_Name")}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card p-7 h-fit sticky top-[150px]">
            <h2 className="font-display text-xl font-semibold text-ink mb-5">{t("Order_Summary")}</h2>

            <div className="space-y-4 text-sm max-h-72 overflow-y-auto scrollbar-hide pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={(item as any).nameEn || (item as any).nameSi || item.nameKey}
                      className="w-14 h-14 object-cover rounded-xl border border-stone-100 flex-shrink-0"
                      onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.png")}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-ink line-clamp-1">
                        {(item as any).nameEn || (item as any).nameSi || item.nameKey}
                      </p>
                      <p className="text-xs text-stone-400">× {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-ink whitespace-nowrap">
                    {t("Rs")} {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 mt-5 pt-4 text-sm space-y-2.5">
              <div className="flex justify-between text-stone-600">
                <span>{t("Subtotal")}</span>
                <span>
                  {t("Rs")} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{t("Delivery_Fee")}</span>
                <span>
                  {t("Rs")} {DELIVERY_FEE.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-ink pt-2 border-t border-stone-100">
                <span>{t("Tot")}</span>
                <span className="font-display text-xl text-evergreen">
                  {t("Rs")} {total.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 mt-4">{t("Statement")}</p>

            <button type="submit" className="btn btn-primary w-full py-3.5 mt-6">
              {t("Place_Order")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
