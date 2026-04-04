"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MonthlyTrend } from "@/types";
import { getMonthName } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  trends: MonthlyTrend[];
}

export default function MonthlyTrendsChart({ trends }: Props) {
  // Build a lookup of { "YYYY-M": { income, expense } }
  const dataMap: Record<string, { income: number; expense: number }> = {};

  for (const t of trends) {
    const key = `${t.year}-${t.month}`;
    if (!dataMap[key]) dataMap[key] = { income: 0, expense: 0 };
    dataMap[key][t.type === "income" ? "income" : "expense"] += t.total;
  }

  const sortedKeys = Object.keys(dataMap).sort((a, b) => {
    const [ay, am] = a.split("-").map(Number);
    const [by, bm] = b.split("-").map(Number);
    return ay !== by ? ay - by : am - bm;
  });

  const labels = sortedKeys.map((k) => {
    const [year, month] = k.split("-").map(Number);
    return `${getMonthName(month)} ${year}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: sortedKeys.map((k) => dataMap[k].income),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Expenses",
        data: sortedKeys.map((k) => dataMap[k].expense),
        backgroundColor: "rgba(244, 63, 94, 0.7)",
        borderColor: "rgba(244, 63, 94, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#94a3b8",
          boxWidth: 12,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "#141720",
        borderColor: "#1e2130",
        borderWidth: 1,
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        callbacks: {
          label: (ctx: any) => ` ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { color: "rgba(30, 33, 48, 0.8)" },
      },
      y: {
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (v: any) => `₹${v.toLocaleString("en-IN")}`,
        },
        grid: { color: "rgba(30, 33, 48, 0.8)" },
      },
    },
  };

  if (!trends.length) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: "var(--text-muted)" }}>
        No trend data available yet
      </div>
    );
  }

  return (
    <div style={{ height: "280px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}