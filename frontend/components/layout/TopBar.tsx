"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Bell, LogOut, TrendingUp, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/records": "Financial Records",
  "/records/new": "Add Record",
  "/users": "User Management",
};

export default function TopBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const title = pageTitles[pathname] || (pathname.includes("/records/") ? "Edit Record" : "FinanceOS");

  return (
    <header
      className="flex items-center justify-between px-6 h-16 border-b shrink-0"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Mobile logo + menu */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
        </div>
        <h1 className="page-title text-lg">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span
          className="hidden sm:inline-flex badge text-xs capitalize"
          style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
        >
          {user?.role}
        </span>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-400">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:block text-sm font-medium" style={{ color: "var(--text-dim)" }}>
            {user?.name}
          </span>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
