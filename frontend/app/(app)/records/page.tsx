"use client";

import { useEffect, useState, useCallback } from "react";
import { FinancialRecord, RecordFilters, PaginatedRecords } from "@/types";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency, formatDate, getTypeBadgeClass, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";
import { Loader2, Pencil, Trash2, ChevronLeft, ChevronRight, SlidersHorizontal, AlertTriangle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// Clean custom delete confirmation dialog — replaces the ugly browser confirm()
function DeleteConfirmModal({
  record,
  onConfirm,
  onCancel,
  loading,
}: {
  record: FinancialRecord;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.85)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden animate-slide-up"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border-bright)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* Red accent line */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #f43f5e 0%, #fb7185 60%, transparent 100%)" }} />

        <div className="p-6">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "#f43f5e" }} />
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold mb-1"
            style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)" }}
          >
            Delete Record?
          </h3>

          {/* Subtitle */}
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
            This action cannot be undone.
          </p>

          {/* Record preview card */}
          <div
            className="rounded-lg p-4 mb-6 flex items-center gap-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {/* Color dot for type */}
            <div
              className="w-2 h-8 rounded-full shrink-0"
              style={{ background: record.type === "income" ? "var(--income)" : "var(--expense)" }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                {record.category}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {formatDate(record.date)} · {record.type}
              </p>
            </div>
            <p
              className="text-sm font-bold shrink-0"
              style={{ color: record.type === "income" ? "var(--income)" : "var(--expense)" }}
            >
              {record.type === "income" ? "+" : "-"}{formatCurrency(record.amount)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
              style={{
                background: "rgba(244,63,94,0.12)",
                border: "1px solid rgba(244,63,94,0.3)",
                color: "#f43f5e",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.12)")}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const { isAnalyst, isAdmin } = useAuth();
  const [data, setData] = useState<PaginatedRecords | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  // Stores the record the user clicked delete on — null means modal is closed
  const [pendingDelete, setPendingDelete] = useState<FinancialRecord | null>(null);

  const [filters, setFilters] = useState<RecordFilters>({
    page: 1,
    limit: 15,
  });

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
      );
      const res = await api.get("/records", { params: cleanedFilters });
      setData(res.data);
    } catch {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Called when user clicks the trash icon — opens the modal
  const handleDeleteClick = (record: FinancialRecord) => {
    setPendingDelete(record);
  };

  // Called when user confirms deletion inside the modal
  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/records/${pendingDelete._id}`);
      toast.success("Record deleted");
      setPendingDelete(null);
      fetchRecords();
    } catch {
      toast.error("Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };

  const updateFilter = (key: keyof RecordFilters, value: any) => {
    // When changing actual filters reset to page 1
    // but when changing the page itself dont reset it back to 1
    const shouldResetPage = key !== "page";
    setFilters((prev) => ({ ...prev, [key]: value, ...(shouldResetPage && { page: 1 }) }));
  };

  const activeFilterCount = [filters.type, filters.category, filters.startDate, filters.endDate]
    .filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ page: 1, limit: 15 });
  };

  const allCategories = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));

  return (
    <div className="space-y-5 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Records</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {data?.pagination.total ?? 0} total transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Clear filters — always visible when any filter is active */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "#f43f5e",
              }}
            >
              ✕ Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}

          {/* Filters toggle — shows a dot badge when filters are active */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2 relative"
            style={showFilters ? { borderColor: "rgba(99,102,241,0.5)", color: "var(--text)" } : {}}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                style={{ background: "#6366f1", fontSize: "10px", fontWeight: 700 }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {isAnalyst && (
            <Link href="/records/new" className="btn-primary">
              + Add Record
            </Link>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Filter Records
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f43f5e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="label">Type</label>
              <select
                className="input"
                value={filters.type || ""}
                onChange={(e) => updateFilter("type", e.target.value || undefined)}
              >
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={filters.category || ""}
                onChange={(e) => updateFilter("category", e.target.value || undefined)}
              >
                <option value="">All categories</option>
                {allCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">From</label>
              <input
                className="input"
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => updateFilter("startDate", e.target.value || undefined)}
              />
            </div>
            <div>
              <label className="label">To</label>
              <input
                className="input"
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => updateFilter("endDate", e.target.value || undefined)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : !data?.records.length ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No records found</p>
            {isAnalyst && (
              <Link href="/records/new" className="text-xs" style={{ color: "var(--accent)" }}>
                Add your first record →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Date", "Type", "Category", "Amount", "Added By", "Notes", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.records.map((record, i) => (
                  <tr
                    key={record._id}
                    className="transition-colors"
                    style={{
                      borderBottom: i < data.records.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "var(--text-dim)" }}>
                      {formatDate(record.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs capitalize ${getTypeBadgeClass(record.type)}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
                      {record.category}
                    </td>
                    <td
                      className="px-4 py-3 text-sm font-semibold"
                      style={{ color: record.type === "income" ? "var(--income)" : "var(--expense)" }}
                    >
                      {record.type === "income" ? "+" : "-"}{formatCurrency(record.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      {(record as any).userId?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {record.notes || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {isAnalyst && (
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/records/${record._id}`}
                            className="p-1.5 rounded-md transition-colors hover:bg-indigo-500/10"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteClick(record)}
                              className="p-1.5 rounded-md transition-colors hover:bg-rose-500/10"
                              style={{ color: "var(--text-muted)" }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Page {data.pagination.page} of {data.pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilter("page", (filters.page || 1) - 1)}
              disabled={(filters.page || 1) <= 1}
              className="btn-secondary px-3 py-1.5 flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <button
              onClick={() => updateFilter("page", (filters.page || 1) + 1)}
              disabled={(filters.page || 1) >= data.pagination.pages}
              className="btn-secondary px-3 py-1.5 flex items-center gap-1 disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal — only renders when pendingDelete is set */}
      {pendingDelete && (
        <DeleteConfirmModal
          record={pendingDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}