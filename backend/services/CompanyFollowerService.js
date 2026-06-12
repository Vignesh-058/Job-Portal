const CompanyFollower = require('../models/CompanyFollower');
const Company = require('../models/Company');

class CompanyFollowerService {
  async followCompany(userId, companyId) {
    const company = await Company.findOne({ _id: companyId, isDeleted: false });
    if (!company) throw new Error('Company not found');

    const existingFollow = await CompanyFollower.findOne({ userId, companyId });
    if (existingFollow) throw new Error('You are already following this company');

    const follower = new CompanyFollower({ userId, companyId });
    await follower.save();

    return { message: `You are now following ${company.name}` };
  }

  async unfollowCompany(userId, companyId) {
    const follower = await CompanyFollower.findOneAndDelete({ userId, companyId });
    if (!follower) throw new Error('You are not following this company');

    return { message: 'Successfully unfollowed the company' };
  }

  async getFollowedCompanies(userId) {
    return await CompanyFollower.find({ userId }).populate('companyId');
  }

  async getCompanyFollowersCount(companyId) {
    return await CompanyFollower.countDocuments({ companyId });
  }
}

module.exports = new CompanyFollowerService();
