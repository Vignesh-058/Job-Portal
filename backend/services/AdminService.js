const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const AuditLog = require('../models/AuditLog');

class AdminService {
  async getDashboardStats() {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalJobs = await Job.countDocuments({ isDeleted: false });
    const totalCompanies = await Company.countDocuments({ isDeleted: false });
    
    // Using aggregation for role breakdown
    const roleStats = await User.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    return { totalUsers, totalJobs, totalCompanies, roleStats };
  }

  async getAllUsers(queryOptions) {
    const { page = 1, limit = 10 } = queryOptions;
    const skip = (page - 1) * limit;

    const totalRecords = await User.countDocuments({ isDeleted: false });
    const users = await User.find({ isDeleted: false })
      .select('-password -refreshToken -resetPasswordToken')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return { totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: Number(page), data: users };
  }

  async toggleBlockUser(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('Cannot block admin');

    user.isBlocked = !user.isBlocked;
    await user.save();
    return { message: user.isBlocked ? 'User blocked' : 'User unblocked', isBlocked: user.isBlocked };
  }

  async hardDeleteJob(id) {
    const job = await Job.findByIdAndDelete(id);
    if (!job) throw new Error('Job not found');
    return { message: 'Job permanently deleted' };
  }

  async getAuditLogs(queryOptions) {
    const { page = 1, limit = 20, userId, action } = queryOptions;
    const skip = (page - 1) * limit;

    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = { $regex: action, $options: 'i' };

    const totalRecords = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('userId', 'name email role')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return { totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: Number(page), data: logs };
  }

  async restoreResource(resourceType, id) {
    let Model;
    switch (resourceType) {
      case 'User': Model = User; break;
      case 'Job': Model = Job; break;
      case 'Company': Model = Company; break;
      default: throw new Error('Invalid resource type');
    }

    const doc = await Model.findById(id);
    if (!doc) throw new Error('Resource not found');

    doc.isDeleted = false;
    doc.deletedAt = undefined;
    await doc.save();
    return { message: `${resourceType} restored successfully` };
  }
}

module.exports = new AdminService();
