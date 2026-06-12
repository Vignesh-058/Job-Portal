const AdminService = require('../services/AdminService');
const AuditLog = require('../models/AuditLog');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await AdminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await AdminService.getAllUsers(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const result = await AdminService.getAuditLogs(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
