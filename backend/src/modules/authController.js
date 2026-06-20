const { sendSuccess, sendError } = require('../utils/responseWrapper');
const AuthService = require('../services/AuthService');

const registerUser = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    return sendSuccess(res, 201, 'Created successfully', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await AuthService.refreshToken(token);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    const result = await AuthService.logout(req.user._id);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const result = await AuthService.verifyEmail(req.params.token);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/login.html?verified=true`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/login.html?error=verification_failed`);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const result = await AuthService.resetPassword(req.params.token, password);
    return sendSuccess(res, 200, 'Success', result);
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword
};
