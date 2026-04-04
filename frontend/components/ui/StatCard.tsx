"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "indigo" | "emerald" | "rose";
  subtitle?: string;
}

const colorMap = {
  indigo: {
    icon: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    glow: "rgba(99,102,241,0.06)",
  },
  emerald: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16,185,129,0.06)",
  },
  rose: {
    icon: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "rgba(244,63,94,0.06)",
  },
};

export default function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const c = colorMap[color];
  const isNegative = value < 0;

  return (
    <div
      className="card relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: `linear-gradient(135deg, var(--card), ${c.glow})` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            {title}
          </p>
          <p className={cn("stat-value animate-count", isNegative ? "text-rose-400" : color === "rose" ? "text-rose-400" : color === "emerald" ? "text-emerald-400" : "text-[var(--text)]")}>
            {formatCurrency(Math.abs(value))}
            {isNegative && <span className="text-lg ml-1 opacity-70">(deficit)</span>}
          </p>
          {subtitle && (
            <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", c.bg, `border ${c.border}`)}>
          <Icon className={cn("w-5 h-5", c.icon)} />
        </div>
      </div>

      {/* Subtle decorative line at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30"
        style={{
          background: color === "emerald"
            ? "linear-gradient(90deg, transparent, #10b981, transparent)"
            : color === "rose"
            ? "linear-gradient(90deg, transparent, #f43f5e, transparent)"
            : "linear-gradient(90deg, transparent, #6366f1, transparent)",
        }}
      />
    </div>
  );
}
