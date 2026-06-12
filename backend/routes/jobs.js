const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
} = require('../controllers/jobController');
const { protect, recruiterOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, recruiterOnly, createJob);

router.get('/my-jobs', protect, recruiterOnly, getMyJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, recruiterOnly, updateJob)
  .delete(protect, recruiterOnly, deleteJob);

module.exports = router;
