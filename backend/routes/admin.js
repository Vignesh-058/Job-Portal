const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getStats,
  getAllUsers,
  getAllJobs,
  toggleBlockUser,
  deleteJob
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/jobs', getAllJobs);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
