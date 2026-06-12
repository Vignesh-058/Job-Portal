const express = require('express');
const router = express.Router();
const { protect, recruiterOnly } = require('../middleware/authMiddleware');
const { companyValidation } = require('../middleware/validationMiddleware');
const {
  createCompany,
  getMyCompanies,
  updateCompany,
  deleteCompany,
  uploadLogo
} = require('../controllers/companyController');
const { upload } = require('../config/cloudinary');

router.use(protect, recruiterOnly);

router.post('/', companyValidation, createCompany);
router.get('/my', getMyCompanies);
router.put('/:id', companyValidation, updateCompany);
router.delete('/:id', deleteCompany);

// Logo upload route
router.post('/:id/upload-logo', upload.single('logo'), uploadLogo);

module.exports = router;
