"use client";

import { useEffect, useState } from "react";
import { DashboardData } from "@/types";
import api from "@/lib/api";
import StatCard from "@/components/ui/StatCard";
import MonthlyTrendsChart from "@/components/charts/MonthlyTrendsChart";
import CategoryChart from "@/components/charts/CategoryChart";
import RecentTransactions from "@/components/ui/RecentTransactions";
import { TrendingUp, TrendingDown, Wallet, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { isAnalyst } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{error || "No data available"}</p>
      </div>
    );
  }

  const { summary, categoryBreakdown, monthlyTrends, recentTransactions } = data;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Overview</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Your financial summary at a glance
          </p>
        </div>
        {isAnalyst && (
          <Link href="/records/new" className="btn-primary">
            + Add Record
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          value={summary.income}
          icon={TrendingUp}
          color="emerald"
          subtitle="All time earnings"
        />
        <StatCard
          title="Total Expenses"
          value={summary.expenses}
          icon={TrendingDown}
          color="rose"
          subtitle="All time spending"
        />
        <StatCard
          title="Net Balance"
          value={summary.balance}
          icon={Wallet}
          color="indigo"
          subtitle={summary.balance >= 0 ? "You're in the green" : "Spending exceeds income"}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly trends takes 2/3 */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-dim)" }}>
            Monthly Trends
          </h3>
          <MonthlyTrendsChart trends={monthlyTrends} />
        </div>

        {/* Category breakdown takes 1/3 */}
        <div className="card">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-dim)" }}>
            By Category
          </h3>
          <CategoryChart breakdown={categoryBreakdown} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-dim)" }}>
            Recent Transactions
          </h3>
          <Link href="/records" className="text-xs" style={{ color: "var(--accent)" }}>
            View all →
          </Link>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
