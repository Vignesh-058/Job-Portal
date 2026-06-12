const express = require('express');
const router = express.Router();
const { uploadResume, removeResume } = require('../controllers/profileController');
const { protect, jobseekerOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/upload-resume', protect, jobseekerOnly, upload.single('resume'), uploadResume);
router.delete('/remove-resume', protect, jobseekerOnly, removeResume);

module.exports = router;
