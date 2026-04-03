export type Role = "admin" | "analyst" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type RecordType = "income" | "expense";

export interface FinancialRecord {
  _id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  userId: string;
  createdAt: string;
}

export interface DashboardSummary {
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryBreakdown {
  type: RecordType;
  category: string;
  total: number;
  count: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  type: RecordType;
  total: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
  recentTransactions: FinancialRecord[];
}

export interface RecordFilters {
  type?: RecordType;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedRecords {
  records: FinancialRecord[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
