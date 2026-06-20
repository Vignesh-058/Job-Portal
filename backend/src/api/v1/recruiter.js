const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../../modules/recruiterController');
const { protect, recruiterOnly } = require('../../middleware/authMiddleware');

router.use(protect, recruiterOnly);

router.get('/analytics', getDashboardMetrics);

module.exports = router;
