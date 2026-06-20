const { sendSuccess, sendError } = require('../utils/responseWrapper');
const CompanyService = require('../services/CompanyService');
const AuditLog = require('../repositories/models/AuditLog');

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

    return sendSuccess(res, 201, 'Created successfully', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getMyCompanies = async (req, res) => {
  try {
    const result = await CompanyService.getMyCompanies(req.user._id);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
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

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
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

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, 'Please upload a file');

    const result = await CompanyService.uploadLogo(req.params.id, req.file.path, req.user._id);

    return sendSuccess(res, 200, 'Success', { message: 'Logo uploaded successfully', logo: result.logo });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const CompanyFollowerService = require('../services/CompanyFollowerService');

const followCompany = async (req, res) => {
  try {
    const result = await CompanyFollowerService.followCompany(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

const unfollowCompany = async (req, res) => {
  try {
    const result = await CompanyFollowerService.unfollowCompany(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

const getFollowedCompanies = async (req, res) => {
  try {
    const result = await CompanyFollowerService.getFollowedCompanies(req.user._id);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getCompanyFollowersCount = async (req, res) => {
  try {
    const count = await CompanyFollowerService.getCompanyFollowersCount(req.params.id);
    return sendSuccess(res, 200, 'Success', { count });
  } catch (error) {
    return sendError(res, 500, error.message);
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
