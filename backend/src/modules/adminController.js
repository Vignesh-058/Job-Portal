const { sendSuccess, sendError } = require('../utils/responseWrapper');
const AdminService = require('../services/AdminService');
const AuditLog = require('../repositories/models/AuditLog');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await AdminService.getDashboardStats();
    return sendSuccess(res, 200, 'Success', stats);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await AdminService.getAllUsers(req.query);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const result = await AdminService.toggleBlockUser(req.params.id);
    
    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: result.isBlocked ? 'Block User' : 'Unblock User',
      resourceType: 'User',
      resourceId: req.params.id
    });

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

const hardDeleteJob = async (req, res) => {
  try {
    const result = await AdminService.hardDeleteJob(req.params.id);

    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Permanent Delete Job',
      resourceType: 'Job',
      resourceId: req.params.id
    });

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const result = await AdminService.getAuditLogs(req.query);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const restoreResource = async (req, res) => {
  try {
    const { resourceType } = req.body;
    const result = await AdminService.restoreResource(resourceType, req.params.id);

    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: `Restore ${resourceType}`,
      resourceType: resourceType,
      resourceId: req.params.id
    });

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  hardDeleteJob,
  getAuditLogs,
  restoreResource
};
