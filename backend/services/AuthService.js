const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../config/mailer');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
};

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error('User already exists');
    }

    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken
    });

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/api/auth/verify-email/${verificationToken}`;
    const message = `
      <h1>You have requested to register an account</h1>
      <p>Please click on the link below to verify your email:</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message
      });
    } catch (error) {
      user.verificationToken = undefined;
      await user.save({ validateBeforeSave: false });
      throw new Error('Email could not be sent');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Registration successful. Please check your email to verify your account.'
    };
  }

  async verifyEmail(token) {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async login(email, password) {
    const user = await User.findOne({ email, isDeleted: false });

    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid email or password');
    }

    if (user.isBlocked) {
      throw new Error('Your account has been blocked');
    }

    if (!user.emailVerified && process.env.NODE_ENV === 'production') {
      throw new Error('Please verify your email before logging in');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken
    };
  }

  async refreshToken(token) {
    if (!token) throw new Error('Not authorized, no refresh token');

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded.id, refreshToken: token, isDeleted: false });

      if (!user) throw new Error('Not authorized, invalid refresh token');

      const newAccessToken = generateAccessToken(user._id);
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Not authorized, token failed');
    }
  }

  async logout(userId) {
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      throw new Error('There is no user with that email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://127.0.0.1:5500'}/frontend/reset-password.html?token=${resetToken}`;
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a PUT request to the following link:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message
      });
      return { message: 'Email sent' };
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new Error('Email could not be sent');
    }
  }

  async resetPassword(resetToken, newPassword) {
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid token');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken
    };
  }
}

module.exports = new AuthService();
