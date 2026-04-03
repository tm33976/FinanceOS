"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { TrendingUp, Eye, EyeOff, Loader2, UserX, X } from "lucide-react";
import toast from "react-hot-toast";

type ErrorType = "not_found" | null;

// This modal is intentionally strict — it cannot be dismissed by clicking
// the backdrop, only by the X button or Try Again. This prevents any
// accidental dismissal or navigation while it's visible.
function AccountNotFoundModal({ onClose }: { onClose: () => void }) {
  // Block body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.92)" }}
      // Intentionally NO onClick on backdrop — user must use the button
    >
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border-bright)",
          boxShadow: "0 32px 64px rgba(0, 0, 0, 0.8)",
          animation: "slideUp 0.25s ease-out",
        }}
      >
        {/* Red accent line */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #f43f5e 0%, #fb7185 60%, transparent 100%)" }} />

        <div className="p-6">
          {/* Icon + close */}
          <div className="flex items-start justify-between mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.2)" }}
            >
              <UserX className="w-5 h-5" style={{ color: "#f43f5e" }} />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)" }}
          >
            Account Not Found
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
            No account exists with that email address. Access to FinanceOS is by invitation only.
          </p>

          {/* Info box */}
          <div
            className="rounded-lg p-4 mb-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border-bright)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#f43f5e" }}
            >
              What should you do?
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)", lineHeight: "1.65" }}>
              Contact your{" "}
              <span style={{ color: "var(--text)", fontWeight: 600 }}>Admin</span> to get
              your credentials. They can create an account for you from the{" "}
              <span style={{ color: "var(--text)", fontWeight: 600 }}>User Management</span> page.
            </p>
          </div>

          {/* CTA */}
          <button onClick={onClose} className="btn-primary w-full py-2.5">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // If already logged in, go to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setShowErrorModal(false);
    try {
      await login(email, password);
      // login() calls router.push("/dashboard") on success — we land there
    } catch (err: any) {
      const status = err.response?.status;
      const message: string = err.response?.data?.message || "";

      if (status === 401) {
        // Show the modal and stay on this page until user explicitly dismisses it
        setShowErrorModal(true);
      } else if (status === 403) {
        toast.error("Your account has been deactivated. Contact your Admin.");
      } else {
        toast.error(message || "Connection error. Is the backend running?");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blob */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
      />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              FinanceOS
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
            Sign in to your account
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Track, analyze, and control your finances
          </p>
        </div>

        {/* Login card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo accounts */}
          <div
            className="mt-6 rounded-lg p-4 text-xs space-y-1"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="font-medium mb-2" style={{ color: "var(--text-dim)" }}>
              Demo accounts:
            </p>
            {[
              { label: "Admin", email: "admin@demo.com" },
              { label: "Analyst", email: "analyst@demo.com" },
              { label: "Viewer", email: "viewer@demo.com" },
            ].map(({ label, email: demoEmail }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setEmail(demoEmail); setPassword("password123"); }}
                className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="badge" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                  {label}
                </span>
                <span>{demoEmail}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal — only mounts when login fails with 401 */}
      {showErrorModal && (
        <AccountNotFoundModal onClose={() => setShowErrorModal(false)} />
      )}
    </div>
  );
}