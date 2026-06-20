const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  hardDeleteJob,
  getAuditLogs,
  restoreResource
} = require('../../modules/adminController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/jobs/:id', hardDeleteJob);
router.get('/audit-logs', getAuditLogs);
router.patch('/restore/:id', restoreResource);

module.exports = router;
