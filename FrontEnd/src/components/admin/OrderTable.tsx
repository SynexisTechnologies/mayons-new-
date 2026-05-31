import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/apiConfig";

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

    // update state immediately
    const updatedOrders = orders.map((order) =>
      order._id === id ? { ...order, status } : order
    );

    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);

  } catch (err) {
    console.error("Failed to update status", err);
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilter(filter);
  }, [filter, orders]);

  const applyFilter = (type: string) => {
    if (type === "ALL") {
      setFilteredOrders(orders);
      return;
    }

    const now = new Date();

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (type === "DAILY") {
        return orderDate.toDateString() === now.toDateString();
      }

      if (type === "WEEKLY") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      }

      if (type === "MONTHLY") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (type === "YEARLY") {
        return orderDate.getFullYear() === now.getFullYear();
      }

      return true;
    });

    setFilteredOrders(filtered);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">
          Order Processing
        </h2>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="ALL">All Orders</option>
          <option value="DAILY">Today</option>
          <option value="WEEKLY">This Week</option>
          <option value="MONTHLY">This Month</option>
          <option value="YEARLY">This Year</option>
        </select>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1e3a5f] text-[#d4af37]">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {order.user?.name || "Guest"}
                  </td>

                  <td>{order.user?.phone || "-"}</td>

                  {/* Address */}
                  <td>
                    {order.shippingAddress?.address ||
                      order.address ||
                      "No Address"}
                  </td>

                  <td>Rs {order.totalPrice}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Update status */}
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
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
                  <td colSpan={6} className="text-center py-5">
                    No Orders Found
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
