const { sendSuccess, sendError } = require('../utils/responseWrapper');
const ApplicationService = require('../services/ApplicationService');
const AuditLog = require('../repositories/models/AuditLog');

const applyForJob = async (req, res) => {
  try {
    const result = await ApplicationService.applyForJob(req.params.jobId, req.user._id, req.body.coverLetter);

    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: 'Apply Job',
      resourceType: 'Application',
      resourceId: result._id
    });

    return sendSuccess(res, 201, 'Created successfully', { message: 'Application submitted successfully', application: result });
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

const getMyApplications = async (req, res) => {
  try {
    const result = await ApplicationService.getMyApplications(req.user._id);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const result = await ApplicationService.getJobApplicants(req.params.jobId, req.user._id, req.query);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const result = await ApplicationService.updateApplicationStatus(req.params.id, req.user._id, req.body.status);

    await AuditLog.create({
      userId: req.user._id,
      role: req.user.role,
      action: `Update Application Status to ${req.body.status}`,
      resourceType: 'Application',
      resourceId: result._id
    });

    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
};
