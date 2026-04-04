"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FinancialRecord } from "@/types";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Props {
  initialData?: Partial<FinancialRecord>;
  recordId?: string; // if provided, we're editing
}

// Default date to today in YYYY-MM-DD format
const todayStr = () => new Date().toISOString().split("T")[0];

export default function RecordForm({ initialData, recordId }: Props) {
  const router = useRouter();
  const isEditing = Boolean(recordId);

  const [form, setForm] = useState({
    amount: initialData?.amount?.toString() || "",
    type: initialData?.type || "expense",
    category: initialData?.category || "",
    date: initialData?.date ? initialData.date.split("T")[0] : todayStr(),
    notes: initialData?.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // When type changes, reset category since the lists differ
  const handleTypeChange = (type: "income" | "expense") => {
    setForm((prev) => ({ ...prev, type, category: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };

      if (isEditing) {
        await api.put(`/records/${recordId}`, payload);
        toast.success("Record updated!");
      } else {
        await api.post("/records", payload);
        toast.success("Record created!");
      }

      router.push("/records");
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {/* Type toggle */}
      <div>
        <label className="label">Transaction Type</label>
        <div className="flex gap-2">
          {(["income", "expense"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border"
              style={{
                background: form.type === type
                  ? type === "income" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)"
                  : "var(--surface)",
                borderColor: form.type === type
                  ? type === "income" ? "rgba(16,185,129,0.4)" : "rgba(244,63,94,0.4)"
                  : "var(--border-bright)",
                color: form.type === type
                  ? type === "income" ? "#10b981" : "#f43f5e"
                  : "var(--text-muted)",
              }}
            >
              {type === "income" ? "↑ Income" : "↓ Expense"}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="label">Amount (INR)</label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            ₹
          </span>
          <input
            className="input pl-7"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <input
          className="input"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Add any extra details..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          maxLength={500}
        />
        <p className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
          {form.notes.length}/500
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? "Update Record" : "Create Record"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/records")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}