const express = require('express');
const {
  getAllArticles,
  getHeadlineArticles,
  createArticle,
  getArticlesByQuery,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  testUpload,
  testFunc1,
  getArticlesTestQuery,
} = require('../controllers/ArticleController');

const router = new express.Router();

router.route('/')
    .get(getAllArticles)
    .post(createArticle);
router.route('/headline')
    .get(getHeadlineArticles);
router
    .route('/test')
    .post(testUpload);
router
    .route('/test1')
    .post(testFunc1);
router
    .route('/test2')
    .get(getArticlesTestQuery);
router
    .route('/search')
    .get(getArticlesByQuery);
router
    .route('/:id')
    .get(getArticleById)
    .put(updateArticle)
    .delete(deleteArticle);


module.exports = router;
