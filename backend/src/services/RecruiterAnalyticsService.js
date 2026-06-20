const Job = require('../repositories/models/Job');
const Application = require('../repositories/models/Application');
const mongoose = require('mongoose');

class RecruiterAnalyticsService {
  async getRecruiterDashboardMetrics(recruiterId) {
    const totalJobs = await Job.countDocuments({ recruiterId, isDeleted: false });
    const activeJobs = await Job.countDocuments({ recruiterId, status: 'Active', isDeleted: false });
    const closedJobs = await Job.countDocuments({ recruiterId, status: 'Closed', isDeleted: false });

    // Aggregate total applications for the recruiter's jobs
    const jobs = await Job.find({ recruiterId, isDeleted: false }).select('_id');
    const jobIds = jobs.map(j => j._id);

    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds }, isDeleted: false });
    const shortlistedCandidates = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'shortlisted', isDeleted: false });
    const rejectedCandidates = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'rejected', isDeleted: false });

    const hiringRate = totalApplications > 0 ? ((shortlistedCandidates / totalApplications) * 100).toFixed(2) : 0;

    // Monthly Application Trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Application.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
          isDeleted: false,
          appliedAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: "$appliedAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return {
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      shortlistedCandidates,
      rejectedCandidates,
      hiringRate: `${hiringRate}%`,
      monthlyTrends
    };
  }
}

module.exports = new RecruiterAnalyticsService();
