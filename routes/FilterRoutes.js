const express = require('express');

const { getFilterArticle } = require('../controllers/FilterController');

const router = new express.Router();

router.route('/article')
    .get(getFilterArticle);

module.exports = router;