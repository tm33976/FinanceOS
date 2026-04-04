"use client";

import { useEffect, useState, FormEvent } from "react";
import { User } from "@/types";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, UserPlus, X, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

// The modal form for creating a new user
function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (user: any) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "viewer" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the admin-only endpoint — this creates the user in the DB
      // with their chosen role. They can immediately log in with these credentials.
      const res = await api.post("/users", form);
      toast.success(`User "${form.name}" created! They can now log in with their email and password.`);
      onCreated(res.data.user);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to create user";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md rounded-xl border animate-slide-up"
        style={{ background: "var(--card)", borderColor: "var(--border-bright)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h3 className="font-semibold" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)" }}>
              Create New User
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Add a new user and assign their role
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="label">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(["viewer", "analyst", "admin"] as const).map((role) => {
                const descriptions = {
                  viewer: "Read-only access",
                  analyst: "View & add records",
                  admin: "Full access",
                };
                const colors = {
                  viewer: { active: "border-slate-500/50 bg-slate-500/10 text-slate-300", dot: "#94a3b8" },
                  analyst: { active: "border-amber-500/50 bg-amber-500/10 text-amber-300", dot: "#f59e0b" },
                  admin: { active: "border-indigo-500/50 bg-indigo-500/10 text-indigo-300", dot: "#6366f1" },
                };
                const isSelected = form.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all"
                    style={{
                      borderColor: isSelected ? undefined : "var(--border-bright)",
                      background: isSelected ? undefined : "var(--surface)",
                    }}
                    // Apply active class via inline style when selected
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: isSelected ? colors[role].dot : "var(--text-muted)" }}
                    />
                    <span
                      className="text-xs font-medium capitalize"
                      style={{ color: isSelected ? colors[role].dot : "var(--text-muted)" }}
                    >
                      {role}
                    </span>
                    <span className="text-xs leading-tight" style={{ color: "var(--text-muted)", fontSize: "10px" }}>
                      {descriptions[role]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? "Creating..." : "Create User"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary px-4">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Page

export default function UsersPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }
    api
      .get("/users")
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [isAdmin, router]);

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      toast.error("You can't delete your own account");
      return;
    }
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleting(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await api.put(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  // When a new user is created via the modal, add them to the top of the list
  const handleUserCreated = (newUser: any) => {
    // Re-fetch to get the full user object with _id and createdAt
    api.get("/users").then((res) => setUsers(res.data.users));
  };

  const roleBadgeStyle = (role: string) => {
    if (role === "admin") return { color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" };
    if (role === "analyst") return { color: "#fbbf24", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" };
    return { color: "#94a3b8", background: "rgba(148,163,184,0.1)", border: "1px solid rgba(148,163,184,0.2)" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">User Management</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Users table */}
      <div className="card p-0 overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No users found</p>
            <button onClick={() => setShowCreateModal(true)} className="text-xs" style={{ color: "var(--accent)" }}>
              Create the first user →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["User", "Role", "Status", "Joined", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const isCurrentUser = user._id === currentUser?.id;
                return (
                  <tr
                    key={user._id}
                    style={{ borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* User info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-indigo-400">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                                you
                              </span>
                            )}
                          </p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role dropdown */}
                    <td className="px-5 py-3.5">
                      <select
                        className="text-xs rounded-md px-2.5 py-1.5 border font-medium capitalize outline-none transition-colors cursor-pointer"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={isCurrentUser}
                        style={{
                          background: "var(--surface)",
                          borderColor: "var(--border-bright)",
                          color: "var(--text-dim)",
                          opacity: isCurrentUser ? 0.5 : 1,
                        }}
                      >
                        <option value="admin">Admin</option>
                        <option value="analyst">Analyst</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>

                    {/* Active status */}
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#10b981" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Active
                      </span>
                    </td>

                    {/* Joined date */}
                    <td className="px-5 py-3.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-3.5">
                      {!isCurrentUser && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deleting === user._id}
                          className="p-1.5 rounded-md transition-colors"
                          style={{ color: "var(--text-muted)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#f43f5e")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                          title="Delete user"
                        >
                          {deleting === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Role legend */}
      <div className="flex items-center gap-4 px-1">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Roles:</p>
        {[
          { role: "Admin", desc: "Full access — CRUD records + manage users", color: "#818cf8" },
          { role: "Analyst", desc: "View records + add/edit records", color: "#fbbf24" },
          { role: "Viewer", desc: "Read-only dashboard access", color: "#94a3b8" },
        ].map(({ role, desc, color }) => (
          <div key={role} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              <span style={{ color }}>{role}</span> — {desc}
            </span>
          </div>
        ))}
      </div>

      {/* Create user modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleUserCreated}
        />
      )}
    </div>
  );
}