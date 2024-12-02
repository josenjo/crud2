const UserModel = require('../models/User');

const getAllUsers = async () => {
  return await UserModel.find();
};

const createUser = async (data) => {
  return await UserModel.create(data);
};

const getUserById = async (id) => {
  return await UserModel.findById(id);
};

const updateUser = async (id, data) => {
  return await UserModel.findByIdAndUpdate(id, data);
};

const deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
