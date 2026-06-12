const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, recruiterOnly, jobseekerOnly } = require('../middleware/authMiddleware');

router.post('/apply/:jobId', protect, jobseekerOnly, applyForJob);
router.get('/my-applications', protect, jobseekerOnly, getMyApplications);
router.get('/job/:jobId', protect, recruiterOnly, getJobApplicants);
router.patch('/:id/status', protect, recruiterOnly, updateApplicationStatus);

module.exports = router;
