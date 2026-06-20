const { sendSuccess, sendError } = require('../utils/responseWrapper');
const JobService = require('../services/JobService');
const AuditLog = require('../repositories/models/AuditLog');

const getJobs = async (req, res) => {
  try {
    const result = await JobService.getJobs(req.query);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getJobById = async (req, res) => {
  try {
    const result = await JobService.getJobById(req.params.id);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const createJob = async (req, res) => {
  try {
    const result = await JobService.createJob(req.body, req.user._id);
    
    // Audit Logging
    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Create Job',
      resourceType: 'Job',
      resourceId: result._id
    });

    return sendSuccess(res, 201, 'Created successfully', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const updateJob = async (req, res) => {
  try {
    const result = await JobService.updateJob(req.params.id, req.body, req.user._id);

    // Audit Logging
    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Update Job',
      resourceType: 'Job',
      resourceId: result._id
    });

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};

const deleteJob = async (req, res) => {
  try {
    const result = await JobService.deleteJob(req.params.id, req.user._id);

    // Audit Logging
    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Soft Delete Job',
      resourceType: 'Job',
      resourceId: req.params.id
    });

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};

const getMyJobs = async (req, res) => {
  try {
    const result = await JobService.getMyJobs(req.user._id, req.query);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};
