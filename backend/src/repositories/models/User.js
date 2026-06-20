const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['jobseeker', 'recruiter', 'admin'],
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  // Enterprise Auth Fields
  refreshToken: {
    type: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Soft Delete Fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  resumeUrl: {
    type: String,
    default: ''
  },
  resumePublicId: {
    type: String,
    default: ''
  },
  profile: {
    skills: {
      type: [String],
      default: []
    },
    resume: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    portfolio: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
