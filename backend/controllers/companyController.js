const CompanyService = require('../services/CompanyService');
const AuditLog = require('../models/AuditLog');

const createCompany = async (req, res) => {
  try {
    const result = await CompanyService.createCompany(req.body, req.user._id);

    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Create Company',
      resourceType: 'Company',
      resourceId: result._id
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyCompanies = async (req, res) => {
  try {
    const result = await CompanyService.getMyCompanies(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const result = await CompanyService.updateCompany(req.params.id, req.body, req.user._id);

    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Update Company',
      resourceType: 'Company',
      resourceId: result._id
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const result = await CompanyService.deleteCompany(req.params.id, req.user._id);

    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Soft Delete Company',
      resourceType: 'Company',
      resourceId: req.params.id
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

    const result = await CompanyService.uploadLogo(req.params.id, req.file.path, req.user._id);

    res.json({ message: 'Logo uploaded successfully', logo: result.logo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const CompanyFollowerService = require('../services/CompanyFollowerService');

const followCompany = async (req, res) => {
  try {
    const result = await CompanyFollowerService.followCompany(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const unfollowCompany = async (req, res) => {
  try {
    const result = await CompanyFollowerService.unfollowCompany(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFollowedCompanies = async (req, res) => {
  try {
    const result = await CompanyFollowerService.getFollowedCompanies(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyFollowersCount = async (req, res) => {
  try {
    const count = await CompanyFollowerService.getCompanyFollowersCount(req.params.id);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getMyCompanies,
  updateCompany,
  deleteCompany,
  uploadLogo,
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
  getCompanyFollowersCount
};
