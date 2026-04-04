import { FinancialRecord } from "@/types";
import { formatCurrency, formatDate, getTypeBadgeClass } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  transactions: FinancialRecord[];
}

export default function RecentTransactions({ transactions }: Props) {
  if (!transactions.length) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
        No transactions yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <div
          key={t._id}
          className="flex items-center gap-3 p-3 rounded-lg transition-colors"
          style={{ background: "var(--surface)" }}
        >
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: t.type === "income" ? "var(--income-bg)" : "var(--expense-bg)",
            }}
          >
            {t.type === "income" ? (
              <ArrowUpRight className="w-4 h-4" style={{ color: "var(--income)" }} />
            ) : (
              <ArrowDownRight className="w-4 h-4" style={{ color: "var(--expense)" }} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
              {t.category}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {formatDate(t.date)}
              {t.notes && ` · ${t.notes}`}
            </p>
          </div>

          {/* Amount */}
          <span
            className="text-sm font-semibold shrink-0"
            style={{ color: t.type === "income" ? "var(--income)" : "var(--expense)" }}
          >
            {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
