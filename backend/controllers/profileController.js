const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload resume
// @route   POST /api/profile/upload-resume
// @access  Private/JobSeeker
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const user = await User.findById(req.user._id);

    // If user already has a resume, delete it from Cloudinary first
    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: 'raw' });
    }

    user.resumeUrl = req.file.path;
    user.resumePublicId = req.file.filename;
    await user.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove resume
// @route   DELETE /api/profile/remove-resume
// @access  Private/JobSeeker
const removeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.resumePublicId) {
      return res.status(400).json({ message: 'No resume found to delete' });
    }

    await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: 'raw' });

    user.resumeUrl = '';
    user.resumePublicId = '';
    await user.save();

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  removeResume
};
