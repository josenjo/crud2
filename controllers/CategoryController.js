const {body, validationResult} = require('express-validator');
const {slugify} = require('../helpers/MainHelper');
const categoryService = require('../services/CategoryService');

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({data: categories, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getCategoriesSelect = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    const categoriesSelect = [];

    categories.map((res) => {
      categoriesSelect.push({label: res.name, value: res._id});
    });
    res.json({data: categoriesSelect, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getCategoriesUrl = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    const categoriesUrl = [];

    categories.map((res) => {
      categoriesUrl.push(res.slug);
    });
    res.json({data: categoriesUrl, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const createCategory = [
  // validate data
  [
    body('name').notEmpty().withMessage('Nama harus diisi'),
    body('description').notEmpty().withMessage('Deskripsi harus diisi'),
  ],
  // create function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const body = req.body;
      const slug = slugify(body.name);
      body['slug'] = slug;

      const category = await categoryService.createCategory(body);
      console.log(body);
      res.json({data: category, status: 'success'});
    } catch (err) {
      console.log(err);
      res.status(500).json({error: err.message});
    }
  },
];

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json({data: category, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const updateCategory = [
  // validate data
  [
    body('name').notEmpty().withMessage('Nama harus diisi'),
    body('description').notEmpty().withMessage('Deskripsi harus diisi'),
  ],
  // update function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const category = await categoryService.updateCategory(
          req.params.id,
          req.body,
      );
      console.log(req.body);
      res.json({data: category, status: 'success'});
    } catch (err) {
      res.status(500).json({error: err.message, line: err.lineNumber});
    }
  },
];

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    res.json({data: category, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

module.exports = {
  getAllCategories,
  getCategoriesSelect,
  getCategoriesUrl,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
