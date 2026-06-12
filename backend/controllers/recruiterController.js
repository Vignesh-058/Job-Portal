const RecruiterAnalyticsService = require('../services/RecruiterAnalyticsService');

const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await RecruiterAnalyticsService.getRecruiterDashboardMetrics(req.user._id);
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardMetrics
};
