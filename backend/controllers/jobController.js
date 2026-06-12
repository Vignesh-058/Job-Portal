const JobService = require('../services/JobService');
const AuditLog = require('../models/AuditLog');

const getJobs = async (req, res) => {
  try {
    const result = await JobService.getJobs(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const result = await JobService.getJobById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
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

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
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

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const result = await JobService.getMyJobs(req.user._id, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
