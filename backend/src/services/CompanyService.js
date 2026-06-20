const Company = require('../repositories/models/Company');

class CompanyService {
  async createCompany(companyData, recruiterId) {
    const company = new Company({ ...companyData, recruiterId });
    return await company.save();
  }

  async getMyCompanies(recruiterId) {
    return await Company.find({ recruiterId, isDeleted: false });
  }

  async updateCompany(id, updateData, recruiterId) {
    const company = await Company.findOne({ _id: id, recruiterId, isDeleted: false });
    if (!company) throw new Error('Company not found or unauthorized');

    Object.assign(company, updateData);
    return await company.save();
  }

  async deleteCompany(id, recruiterId) {
    const company = await Company.findOne({ _id: id, recruiterId, isDeleted: false });
    if (!company) throw new Error('Company not found or unauthorized');

    company.isDeleted = true;
    company.deletedAt = Date.now();
    await company.save();
    return { message: 'Company removed successfully' };
  }

  async uploadLogo(id, filePath, recruiterId) {
    const company = await Company.findOne({ _id: id, recruiterId, isDeleted: false });
    if (!company) throw new Error('Company not found or unauthorized');

    company.logo = filePath;
    await company.save();
    return company;
  }
}

module.exports = new CompanyService();
