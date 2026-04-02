const Record = require("../models/Record");

// Summary: total income, total expenses, net balance — across ALL records
// TODO: add date range filter here so dashboard can show stats for a specific period
const getSummary = async () => {
  const result = await Record.aggregate([
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const income = result.find((r) => r._id === "income")?.total || 0;
  const expenses = result.find((r) => r._id === "expense")?.total || 0;

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

// Category breakdown across all records
const getCategoryBreakdown = async () => {
  return Record.aggregate([
    {
      $group: {
        _id: { type: "$type", category: "$category" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        category: "$_id.category",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);
};

// Monthly trends for the last N months across all records
const getMonthlyTrends = async (months = 12) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months + 1);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  return Record.aggregate([
    {
      $match: { date: { $gte: startDate } },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        total: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);
};

// Recent transactions from all users
const getRecentTransactions = async (limit = 10) => {
  return Record.find()
    .sort({ date: -1 })
    .limit(limit)
    .populate("userId", "name email") // show who added each transaction
    .select("amount type category date notes userId")
    .lean();
};

// Combine everything into one dashboard response
const getDashboardData = async () => {
  const [summary, categoryBreakdown, monthlyTrends, recentTransactions] = await Promise.all([
    getSummary(),
    getCategoryBreakdown(),
    getMonthlyTrends(),
    getRecentTransactions(),
  ]);

  return { summary, categoryBreakdown, monthlyTrends, recentTransactions };
};

module.exports = { getDashboardData, getSummary, getCategoryBreakdown, getMonthlyTrends };