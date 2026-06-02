import OrdersTable from "../../components/admin/OrderTable";

export default function AdminOrders() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-ink">Orders</h2>
        <p className="text-sm text-stone-400">Track and manage customer orders</p>
      </div>
      <OrdersTable />
    </div>
  );
}
