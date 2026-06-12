const ApplicationService = require('../services/ApplicationService');
const AuditLog = require('../models/AuditLog');

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

    res.status(201).json({ message: 'Application submitted successfully', application: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const result = await ApplicationService.getMyApplications(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const result = await ApplicationService.getJobApplicants(req.params.jobId, req.user._id, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
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

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
};
