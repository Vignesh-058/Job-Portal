const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['jobseeker', 'recruiter', 'admin'],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['User', 'Job', 'Company', 'Application', 'Auth'],
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Sometimes it's a general action like login
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 365 * 24 * 60 * 60 // Optional: auto-delete logs after 1 year
  }
});

auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ userId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
