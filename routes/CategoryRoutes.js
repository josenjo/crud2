const express = require('express');
const {
  getAllCategories,
  getCategoriesSelect,
  getCategoriesUrl,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/CategoryController');

const router = new express.Router();

router.route('/')
    .get(getAllCategories)
    .post(createCategory);
router.route('/select')
    .get(getCategoriesSelect);
router.route('/url')
    .get(getCategoriesUrl);
router
    .route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
