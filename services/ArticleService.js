const {yesterday, startOfWeek, endOfWeek, startOfLastWeek, endOfLastWeek} = require('../helpers/DateHelper');
const ArticleModel = require('../models/Article');

const getAllArticles = async () => {
  return await ArticleModel.find();
};

const getHeadlineArticles = async () => {
  return await ArticleModel.find().limit(3);
};

const createArticle = async (data) => {
  return await ArticleModel.create(data);
};

const testQuery1 = async (query) => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  console.log(`current date ${date}`);
  console.log(`start date ${startDate}`);
  console.log(`end date ${endDate}`);

  let filter = {
    title: { $regex: query, $options: "i" },
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };

  return ArticleModel.find(filter);
};

const getArticlesByQuery = async (query, body) => {
  let filter = {
    title: { $regex: query, $options: "i" }
  };

  if(typeof(body.category) !== 'undefined') {
    filter.category = body.category;
  }

  if(typeof(body.time) !== 'undefined') {
    switch(body.time) {
      case 1: 
        filter.createdAt = new Date();
        break;
      case 2: 
        filter.createdAt = yesterday;
        break;
      case 3: 
        filter.createdAt.$gte = startOfWeek;
        filter.createdAt.$lte = endOfWeek;
        break;
      case 4: 
        filter.createdAt.$gte = startOfLastWeek;
        filter.createdAt.$lte = endOfLastWeek;
        break;
    }
  }

  let queries = ArticleModel.find(filter);

  if(Object.keys(body).length !== 0) {
    if(typeof(body.sort) !== 'undefined') {
      queries = queries.sort({createdAt: body.sort == 1 ? -1 : 1});
    }
  }

  return await queries;
};

const getArticleById = async (id) => {
  return await ArticleModel.findById(id);
};

const getArticleBySlug = async (slug) => {
  return await ArticleModel.find({slug: slug});
};

const updateArticle = async (id, data) => {
  return await ArticleModel.findByIdAndUpdate(id, data);
};

const deleteArticle = async (id) => {
  return await ArticleModel.findByIdAndDelete(id);
};

module.exports = {
  getAllArticles,
  getHeadlineArticles,
  createArticle,
  getArticlesByQuery,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  testQuery1,
};
