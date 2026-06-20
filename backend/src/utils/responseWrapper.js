/**
 * Standardize API responses across the enterprise application
 */
const sendSuccess = (res, statusCode = 200, message = 'Operation completed successfully', data = {}, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
};

const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  sendSuccess,
  sendError
};
