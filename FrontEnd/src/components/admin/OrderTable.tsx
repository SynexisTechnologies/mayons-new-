import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/apiConfig";

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const FILTERS = ["ALL", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/orders/admin");
      setOrders(res.data.data);
      setFilteredOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axiosInstance.put(`/orders/admin/${id}/status`, { status });
      const updated = orders.map((o) => (o._id === id ? { ...o, status } : o));
      setOrders(updated);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    if (filter === "ALL") { setFilteredOrders(orders); return; }
    const now = new Date();
    setFilteredOrders(
      orders.filter((order) => {
        const d = new Date(order.createdAt);
        if (filter === "DAILY") return d.toDateString() === now.toDateString();
        if (filter === "WEEKLY") return d >= new Date(now.getTime() - 7 * 864e5);
        if (filter === "MONTHLY") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (filter === "YEARLY") return d.getFullYear() === now.getFullYear();
        return true;
      })
    );
  }, [filter, orders]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-[#1e3a5f]">Order Processing</h2>
          <p className="text-xs text-gray-400 mt-0.5">{filteredOrders.length} orders</p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === f
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {f === "ALL" ? "All" : f === "DAILY" ? "Today" : f === "WEEKLY" ? "Week" : f === "MONTHLY" ? "Month" : "Year"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
          Loading orders…
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1e3a5f]/5 text-[#1e3a5f] text-xs font-semibold uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Recipient</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Delivery</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Update</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5 font-medium text-gray-800">
                    {order.recipient?.name || order.user?.name || "Guest"}
                    {order.recipient?.senderName && (
                      <span className="block text-xs text-gray-400 font-normal">
                        from {order.recipient.senderName}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {order.recipient?.phone || order.user?.phone || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 max-w-[180px] truncate">
                    {order.recipient?.address || order.shippingAddress?.address || order.address || "No Address"}
                    {order.recipient?.city && (
                      <span className="block text-xs text-gray-400">{order.recipient.city}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                    {order.recipient?.deliveryDate || "—"}
                    {order.recipient?.deliveryTimeSlot && (
                      <span className="block text-xs text-gray-400">{order.recipient.deliveryTimeSlot}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-[#1e3a5f]">
                    Rs {order.totalPrice?.toLocaleString()}
                    {!!order.deliveryFee && (
                      <span className="block text-xs text-gray-400 font-normal">
                        incl. Rs {order.deliveryFee} delivery
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-xs border border-gray-200 px-2 py-1.5 rounded-lg bg-white focus:border-[#1e3a5f] outline-none transition">
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-gray-400 text-sm">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
