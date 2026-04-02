const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res, next) => {
  try {
    // No userId — dashboard shows data across all users
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };