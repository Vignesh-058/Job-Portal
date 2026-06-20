const User = require('./models/User');

class UserRepository {
  async findById(id) {
    return await User.findById(id).select('-password -refreshToken -resetPasswordToken');
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new UserRepository();
