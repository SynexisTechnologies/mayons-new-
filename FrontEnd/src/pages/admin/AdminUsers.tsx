import UsersTable from "../../components/admin/UsersTable";

export default function AdminUsers() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-ink">Users</h2>
        <p className="text-sm text-stone-400">Manage registered accounts and roles</p>
      </div>
      <UsersTable />
    </div>
  );
}
