"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CategoryBreakdown } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  breakdown: CategoryBreakdown[];
}

const PALETTE = [
  "#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#3b82f6",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#ef4444",
];

export default function CategoryChart({ breakdown }: Props) {
  const [activeType, setActiveType] = useState<"income" | "expense">("expense");

  const filtered = breakdown.filter((b) => b.type === activeType);
  const total = filtered.reduce((sum, b) => sum + b.total, 0);

  const data = {
    labels: filtered.map((b) => b.category),
    datasets: [
      {
        data: filtered.map((b) => b.total),
        backgroundColor: PALETTE.slice(0, filtered.length),
        borderColor: "#0a0c14",
        borderWidth: 2,
        hoverBorderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#141720",
        borderColor: "#1e2130",
        borderWidth: 1,
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        callbacks: {
          label: (ctx: any) => {
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ₹${ctx.parsed.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (${pct}%)`;
          },
        },
      },
    },
  };

  if (!breakdown.length) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: "var(--text-muted)" }}>
        No category data available yet
      </div>
    );
  }

  return (
    <div>
      {/* Toggle */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg w-fit" style={{ background: "var(--surface)" }}>
        {(["expense", "income"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
            style={{
              background: activeType === type ? (type === "expense" ? "#f43f5e22" : "#10b98122") : "transparent",
              color: activeType === type ? (type === "expense" ? "#f43f5e" : "#10b981") : "var(--text-muted)",
              border: activeType === type ? `1px solid ${type === "expense" ? "#f43f5e44" : "#10b98144"}` : "1px solid transparent",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex gap-6 items-center">
        {/* Chart */}
        <div style={{ width: "160px", height: "160px", flexShrink: 0 }}>
          {filtered.length > 0 ? (
            <Doughnut data={data} options={options} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>
              No data
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 min-w-0">
          {filtered.slice(0, 6).map((item, i) => (
            <div key={item.category} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PALETTE[i] }} />
                <span className="text-xs truncate" style={{ color: "var(--text-dim)" }}>
                  {item.category}
                </span>
              </div>
              <span className="text-xs font-medium shrink-0" style={{ color: "var(--text)" }}>
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}