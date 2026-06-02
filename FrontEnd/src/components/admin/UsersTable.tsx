import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/apiConfig";
import {
  Search, KeyRound, Trash2, ShieldCheck, User as UserIcon,
  CheckCircle, XCircle, Eye, EyeOff, AlertTriangle, RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: "admin" | "user";
  status: "Active" | "Inactive";
  isVerified: boolean;
  createdAt: string;
  licenseExpire?: string;
}

const DEFAULT_ADMIN_EMAIL = "admin@example.com";

export default function UsersTable() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");

  const [resetModal, setResetModal] = useState<{ open: boolean; user: UserData | null }>({ open: false, user: null });
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: UserData | null }>({ open: false, user: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/auth/users");
      setUsers(res.data.users || []);
    } catch {
      showToast("Failed to load users", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => {
    const matchSearch =
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleRole = async (u: UserData) => {
    setActionLoading(u._id + "-role");
    try {
      const newRole = u.role === "admin" ? "user" : "admin";
      await axiosInstance.patch(`/auth/users/${u._id}`, { role: newRole });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
      showToast(`${u.firstName} is now ${newRole}`);
    } catch { showToast("Failed to change role", "error"); }
    finally { setActionLoading(null); }
  };

  const toggleStatus = async (u: UserData) => {
    setActionLoading(u._id + "-status");
    try {
      const newStatus = u.status === "Active" ? "Inactive" : "Active";
      await axiosInstance.patch(`/auth/users/${u._id}`, { status: newStatus });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, status: newStatus } : x));
      showToast(`${u.firstName} is now ${newStatus}`);
    } catch { showToast("Failed to change status", "error"); }
    finally { setActionLoading(null); }
  };

  const handleResetPassword = async () => {
    if (!resetModal.user) return;
    setResetError("");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPw)) {
      setResetError("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a symbol");
      return;
    }
    if (newPw !== confirmPw) { setResetError("Passwords do not match"); return; }
    setResetLoading(true);
    try {
      await axiosInstance.post(`/auth/users/${resetModal.user._id}/reset-password`, { newPassword: newPw });
      showToast(`Password reset for ${resetModal.user.firstName}`);
      setResetModal({ open: false, user: null });
      setNewPw(""); setConfirmPw("");
    } catch (e: any) {
      setResetError(e.response?.data?.message || "Reset failed");
    } finally { setResetLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/auth/users/${deleteModal.user._id}`);
      setUsers(prev => prev.filter(x => x._id !== deleteModal.user!._id));
      showToast(`${deleteModal.user.firstName} deleted`);
      setDeleteModal({ open: false, user: null });
    } catch (e: any) {
      showToast(e.response?.data?.message || "Delete failed", "error");
    } finally { setDeleteLoading(false); }
  };

  const initials = (u: UserData) =>
    `${u.firstName[0] || ""}${u.lastName[0] || ""}`.toUpperCase();

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 transition-all ${toast.type === "success" ? "bg-[#1e3a5f] text-white" : "bg-red-600 text-white"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1e3a5f] cursor-pointer">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1e3a5f] cursor-pointer">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={load} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer" title="Refresh">
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} of {users.length} users</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Verified</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Joined</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => {
                  const isMe = me?.email === u.email;
                  const isDefault = u.email === DEFAULT_ADMIN_EMAIL;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/60 transition group">
                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${u.role === "admin" ? "bg-[#d4af37]/15 text-[#d4af37]" : "bg-[#1e3a5f]/8 text-[#1e3a5f]"}`}>
                            {initials(u)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1e3a5f] leading-none">
                              {u.firstName} {u.lastName}
                              {isMe && <span className="ml-1.5 text-[9px] bg-[#1e3a5f] text-white px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
                              {isDefault && <span className="ml-1.5 text-[9px] bg-[#d4af37] text-[#1e3a5f] px-1.5 py-0.5 rounded-full font-bold">DEFAULT</span>}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-[#d4af37]/15 text-[#a88a20]" : "bg-slate-100 text-slate-500"}`}>
                          {u.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${u.status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                          {u.status}
                        </span>
                      </td>

                      {/* Verified */}
                      <td className="px-4 py-3.5">
                        {u.isVerified
                          ? <CheckCircle className="w-4 h-4 text-green-500" />
                          : <XCircle className="w-4 h-4 text-slate-300" />}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {fmtDate(u.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle role */}
                          <button
                            onClick={() => toggleRole(u)}
                            disabled={!!actionLoading || isMe}
                            title={isMe ? "Cannot change your own role" : `Make ${u.role === "admin" ? "user" : "admin"}`}
                            className="p-1.5 rounded-lg hover:bg-[#d4af37]/15 text-slate-400 hover:text-[#a88a20] transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {actionLoading === u._id + "-role"
                              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              : <ShieldCheck className="w-3.5 h-3.5" />}
                          </button>

                          {/* Toggle status */}
                          <button
                            onClick={() => toggleStatus(u)}
                            disabled={!!actionLoading || isMe}
                            title={isMe ? "Cannot change your own status" : `Mark as ${u.status === "Active" ? "Inactive" : "Active"}`}
                            className={`p-1.5 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${u.status === "Active" ? "hover:bg-red-50 text-slate-400 hover:text-red-500" : "hover:bg-green-50 text-slate-400 hover:text-green-600"}`}
                          >
                            {actionLoading === u._id + "-status"
                              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              : u.status === "Active" ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          </button>

                          {/* Reset password */}
                          <button
                            onClick={() => { setResetModal({ open: true, user: u }); setNewPw(""); setConfirmPw(""); setResetError(""); setShowPw(false); }}
                            title="Reset password"
                            className="p-1.5 rounded-lg hover:bg-[#1e3a5f]/8 text-slate-400 hover:text-[#1e3a5f] transition cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteModal({ open: true, user: u })}
                            disabled={isMe}
                            title={isMe ? "Cannot delete your own account" : "Delete user"}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {resetModal.open && resetModal.user && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#1e3a5f]/8 rounded-xl flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#1e3a5f]">Reset Password</h3>
                <p className="text-xs text-slate-400">{resetModal.user.firstName} {resetModal.user.lastName} · {resetModal.user.email}</p>
              </div>
            </div>

            {resetModal.user.email === DEFAULT_ADMIN_EMAIL && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">This is the default admin account. Make sure to remember the new password.</p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm pr-11 focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f] outline-none transition"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Confirm Password</label>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f] outline-none transition"
                />
              </div>
              {resetError && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{resetError}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setResetModal({ open: false, user: null })}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition text-sm cursor-pointer">
                Cancel
              </button>
              <button onClick={handleResetPassword} disabled={resetLoading}
                className="flex-1 bg-[#1e3a5f] text-white py-2.5 rounded-xl font-bold hover:bg-[#2a4a7c] transition disabled:opacity-60 text-sm cursor-pointer shadow-sm">
                {resetLoading ? "Resetting…" : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal.open && deleteModal.user && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-extrabold text-[#1e3a5f] text-lg mb-1">Delete User?</h3>
            <p className="text-slate-400 text-sm mb-1">
              <span className="font-semibold text-[#1e3a5f]">{deleteModal.user.firstName} {deleteModal.user.lastName}</span>
            </p>
            <p className="text-slate-400 text-xs mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ open: false, user: null })}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition text-sm cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-60 text-sm cursor-pointer shadow-sm">
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
