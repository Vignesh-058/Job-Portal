const express = require('express');
const router = express.Router();
const {
  createCompany,
  getMyCompanies,
  updateCompany,
  deleteCompany,
  uploadLogo,
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
  getCompanyFollowersCount
} = require('../../modules/companyController');
const { protect, recruiterOnly } = require('../../middleware/authMiddleware');
const { companyValidation } = require('../../middleware/validationMiddleware');
const { upload } = require('../../config/cloudinary');

// Basic Recruiter routes
router.post('/', protect, recruiterOnly, companyValidation, createCompany);
router.get('/my', protect, recruiterOnly, getMyCompanies);
router.put('/:id', protect, recruiterOnly, companyValidation, updateCompany);
router.delete('/:id', protect, recruiterOnly, deleteCompany);
router.post('/:id/upload-logo', protect, recruiterOnly, upload.single('logo'), uploadLogo);

// Follower feature routes
router.post('/:id/follow', protect, followCompany);
router.delete('/:id/unfollow', protect, unfollowCompany);
router.get('/followed', protect, getFollowedCompanies);
router.get('/:id/followers/count', getCompanyFollowersCount);

module.exports = router;
