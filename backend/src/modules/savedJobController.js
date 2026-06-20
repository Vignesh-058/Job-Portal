const { sendSuccess, sendError } = require('../utils/responseWrapper');
const SavedJob = require('../repositories/models/SavedJob');
const Job = require('../repositories/models/Job');

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private/JobSeeker
const saveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 404, 'Job not found');
    }

    const savedJob = new SavedJob({
      userId: req.user._id,
      jobId
    });

    await savedJob.save();
    return sendSuccess(res, 201, 'Created successfully', { message: 'Job saved successfully', savedJob });
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 400, 'Job already saved');
    }
    return sendError(res, 500, error.message);
  }
};

// @desc    Get saved jobs
// @route   GET /api/saved-jobs
// @access  Private/JobSeeker
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      })
      .sort({ savedAt: -1 });
    
    return sendSuccess(res, 200, 'Success', savedJobs);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:id
// @access  Private/JobSeeker
const removeSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!savedJob) {
      return sendError(res, 404, 'Saved job not found');
    }

    return sendSuccess(res, 200, 'Success', { message: 'Job removed from saved list' });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob
};
