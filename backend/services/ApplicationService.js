const Application = require('../models/Application');
const Job = require('../models/Job');
const socketConfig = require('../config/socket');
const Notification = require('../models/Notification');

class ApplicationService {
  async applyForJob(jobId, userId, coverLetter) {
    const job = await Job.findOne({ _id: jobId, isDeleted: false });
    if (!job) throw new Error('Job not found');

    const existingApplication = await Application.findOne({ jobId, userId, isDeleted: false });
    if (existingApplication) throw new Error('You have already applied for this job');

    const application = new Application({ userId, jobId, coverLetter });
    await application.save();

    // Send Real-Time Notification to Recruiter
    try {
      await Notification.create({
        userId: job.recruiterId,
        title: 'New Application',
        message: `A new candidate applied for ${job.title}`
      });

      const io = socketConfig.getIo();
      io.emit(`notification-${job.recruiterId}`, {
        type: 'NEW_APPLICATION',
        jobId,
        title: 'New Application'
      });
    } catch (err) {
      console.error('Notification error', err);
    }

    return application;
  }

  async getMyApplications(userId) {
    return await Application.find({ userId, isDeleted: false })
      .populate('jobId')
      .sort({ appliedAt: -1 });
  }

  async getJobApplicants(jobId, recruiterId, queryOptions) {
    const job = await Job.findOne({ _id: jobId, isDeleted: false });
    if (!job) throw new Error('Job not found');
    if (job.recruiterId.toString() !== recruiterId.toString()) throw new Error('Not authorized');

    const { page = 1, limit = 10 } = queryOptions;
    const skip = (page - 1) * limit;

    const totalRecords = await Application.countDocuments({ jobId, isDeleted: false });
    const applications = await Application.find({ jobId, isDeleted: false })
      .populate('userId', 'name email profile resumeUrl resumePublicId')
      .skip(skip)
      .limit(Number(limit))
      .sort({ appliedAt: -1 });
      
    return {
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: Number(page),
      data: applications
    };
  }

  async updateApplicationStatus(applicationId, recruiterId, status) {
    const application = await Application.findOne({ _id: applicationId, isDeleted: false }).populate('jobId');
    if (!application) throw new Error('Application not found');

    if (application.jobId.recruiterId.toString() !== recruiterId.toString()) {
      throw new Error('Not authorized to update this application');
    }

    application.status = status;
    await application.save();

    // Send Notification to Job Seeker
    try {
      await Notification.create({
        userId: application.userId,
        title: 'Application Update',
        message: `Your application for ${application.jobId.title} was marked as ${status}`
      });

      const io = socketConfig.getIo();
      io.emit(`notification-${application.userId}`, {
        type: 'APPLICATION_UPDATE',
        jobId: application.jobId._id,
        status,
        title: 'Application Update'
      });
    } catch (err) {
      console.error('Notification error', err);
    }

    return application;
  }
}

module.exports = new ApplicationService();
