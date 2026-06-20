const express = require('express');
const router = express.Router();
const { protect, jobseekerOnly } = require('../../middleware/authMiddleware');
const {
  saveJob,
  getSavedJobs,
  removeSavedJob
} = require('../../modules/savedJobController');

router.use(protect, jobseekerOnly);

router.post('/:jobId', saveJob);
router.get('/', getSavedJobs);
router.delete('/:id', removeSavedJob);

module.exports = router;
