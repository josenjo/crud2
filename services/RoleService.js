const RoleModel = require('../models/Role');

const getAllRoles = async () => {
  return await RoleModel.find();
};

const createRole = async (data) => {
  return await RoleModel.create(data);
};

const getRoleById = async (id) => {
  return await RoleModel.findById(id);
};

const updateRole = async (id, data) => {
  return await RoleModel.findByIdAndUpdate(id, data);
};

const deleteRole = async (id) => {
  return await RoleModel.findByIdAndDelete(id);
};

module.exports = {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
};
