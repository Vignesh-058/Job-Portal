const { sendSuccess, sendError } = require('../utils/responseWrapper');
const RecruiterAnalyticsService = require('../services/RecruiterAnalyticsService');

const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await RecruiterAnalyticsService.getRecruiterDashboardMetrics(req.user._id);
    return sendSuccess(res, 200, 'Success', metrics);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getDashboardMetrics
};
