const mongoose = require('mongoose');

const companyFollowerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only follow a company once
companyFollowerSchema.index({ userId: 1, companyId: 1 }, { unique: true });

const CompanyFollower = mongoose.model('CompanyFollower', companyFollowerSchema);
module.exports = CompanyFollower;
