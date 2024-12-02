const CategoryModel = require('../models/Category');

const getAllCategories = async () => {
  return await CategoryModel.find();
};

const createCategory = async (data) => {
  return await CategoryModel.create(data);
};

const getCategoryById = async (id) => {
  return await CategoryModel.findById(id);
};

const updateCategory = async (id, data) => {
  return await CategoryModel.findByIdAndUpdate(id, data);
};

const deleteCategory = async (id) => {
  return await CategoryModel.findByIdAndDelete(id);
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
