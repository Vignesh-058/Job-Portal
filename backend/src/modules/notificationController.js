const { sendSuccess, sendError } = require('../utils/responseWrapper');
const Notification = require('../repositories/models/Notification');

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Success', notifications);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!notification) {
      return sendError(res, 404, 'Notification not found');
    }

    notification.read = true;
    await notification.save();

    return sendSuccess(res, 200, 'Success', notification);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Create notification utility function (Not an API route)
const createNotification = async (userId, title, message) => {
  try {
    await Notification.create({ userId, title, message });
  } catch (error) {
    console.error('Failed to create notification', error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification
};
