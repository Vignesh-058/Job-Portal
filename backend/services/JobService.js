const Job = require('../models/Job');
const Company = require('../models/Company');

class JobService {
  async getJobs(queryOptions) {
    const { page = 1, limit = 10, title, location, jobType, remote, salaryRange, company } = queryOptions;
    const skip = (page - 1) * limit;

    const query = { status: 'Active', isDeleted: false };

    if (title) query.$text = { $search: title }; // Using text index
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.type = jobType;
    if (remote === 'true') query.type = 'remote';
    if (salaryRange) query.salary = { $regex: salaryRange, $options: 'i' };

    if (company) {
      const companies = await Company.find({ name: { $regex: company, $options: 'i' }, isDeleted: false });
      query.companyId = { $in: companies.map(c => c._id) };
    }

    const totalRecords = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return { totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: Number(page), data: jobs };
  }

  async getJobById(id) {
    const job = await Job.findOne({ _id: id, isDeleted: false })
      .populate('recruiterId', 'name email')
      .populate('companyId');
    
    if (!job) throw new Error('Job not found');
    return job;
  }

  async createJob(jobData, recruiterId) {
    const job = new Job({
      ...jobData,
      recruiterId
    });
    return await job.save();
  }

  async updateJob(id, updateData, recruiterId) {
    const job = await Job.findOne({ _id: id, isDeleted: false });
    if (!job) throw new Error('Job not found');
    if (job.recruiterId.toString() !== recruiterId.toString()) throw new Error('Not authorized');

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true }).populate('companyId');
    return updatedJob;
  }

  async deleteJob(id, recruiterId) {
    const job = await Job.findOne({ _id: id, isDeleted: false });
    if (!job) throw new Error('Job not found');
    if (job.recruiterId.toString() !== recruiterId.toString()) throw new Error('Not authorized');

    // Soft delete
    job.isDeleted = true;
    job.deletedAt = Date.now();
    await job.save();
    return { message: 'Job removed' };
  }

  async getMyJobs(recruiterId, queryOptions) {
    const { page = 1, limit = 10 } = queryOptions;
    const skip = (page - 1) * limit;

    const query = { recruiterId, isDeleted: false };
    
    const totalRecords = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return { totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: Number(page), data: jobs };
  }
}

module.exports = new JobService();
