const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private/JobSeeker
const saveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const savedJob = new SavedJob({
      userId: req.user._id,
      jobId
    });

    await savedJob.save();
    res.status(201).json({ message: 'Job saved successfully', savedJob });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    res.status(500).json({ message: error.message });
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
    
    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:id
// @access  Private/JobSeeker
const removeSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.status(200).json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob
};
