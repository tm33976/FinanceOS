import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("en-IN", { month: "short" });
}

// Returns a Tailwind color class based on record type
export function getTypeColor(type: "income" | "expense"): string {
  return type === "income" ? "text-emerald-400" : "text-rose-400";
}

export function getTypeBadgeClass(type: "income" | "expense"): string {
  return type === "income"
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    : "bg-rose-500/10 text-rose-400 border border-rose-500/20";
}

export const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Investments", "Rental", "Bonus", "Other Income",
];

export const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Utilities", "Rent", "Entertainment",
  "Healthcare", "Shopping", "Education", "Other",
];