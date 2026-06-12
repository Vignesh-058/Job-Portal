const Company = require('../models/Company');
const { cloudinary } = require('../config/cloudinary');

// @desc    Create a new company
// @route   POST /api/company
// @access  Private/Recruiter
const createCompany = async (req, res) => {
  try {
    const { name, website, description } = req.body;
    
    const company = new Company({
      name,
      website,
      description,
      recruiterId: req.user._id
    });

    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter's companies
// @route   GET /api/company/my
// @access  Private/Recruiter
const getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ recruiterId: req.user._id });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company
// @route   PUT /api/company/:id
// @access  Private/Recruiter
const updateCompany = async (req, res) => {
  try {
    const { name, website, description } = req.body;
    const company = await Company.findOne({ _id: req.params.id, recruiterId: req.user._id });

    if (!company) {
      return res.status(404).json({ message: 'Company not found or unauthorized' });
    }

    company.name = name || company.name;
    company.website = website || company.website;
    company.description = description || company.description;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete company
// @route   DELETE /api/company/:id
// @access  Private/Recruiter
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, recruiterId: req.user._id });

    if (!company) {
      return res.status(404).json({ message: 'Company not found or unauthorized' });
    }

    await company.remove();
    res.json({ message: 'Company removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload company logo
// @route   POST /api/company/:id/upload-logo
// @access  Private/Recruiter
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const company = await Company.findOne({ _id: req.params.id, recruiterId: req.user._id });

    if (!company) {
      return res.status(404).json({ message: 'Company not found or unauthorized' });
    }

    company.logo = req.file.path;
    await company.save();

    res.json({
      message: 'Logo uploaded successfully',
      logo: company.logo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getMyCompanies,
  updateCompany,
  deleteCompany,
  uploadLogo
};
