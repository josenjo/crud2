const {body, validationResult} = require('express-validator');
const {slugify} = require('../helpers/MainHelper');
const articleService = require('../services/ArticleService');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// init variables
const resolutionList = [
  {
    width: 100,
    height: 100
  },
  {
    width: 250,
    height: 141
  },
  {
    width: 640,
    height: 360
  },
];

// init storage & file filter
const diskStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join('./', 'uploads/articles'));
  },
  filename: function(req, file, cb) {
    cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

// all functions
const getAllArticles = async (req, res) => {
  try {
    const articles = await articleService.getAllArticles();
    res.json({data: articles, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getHeadlineArticles = async (req, res) => {
  try {
    const articles = await articleService.getHeadlineArticles();
    res.json({data: articles, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const createArticle = [
  // upload photo
  multer({storage: diskStorage}).single('photo'),
  // validate data
  [
    body('title').notEmpty().withMessage('Judul harus diisi'),
    body('category').notEmpty().withMessage('Kategori harus diisi'),
    body('content').notEmpty().withMessage('Isi konten harus diisi'),
    // body('photo').notEmpty().withMessage('Foto harus diisi'),
  ],
  // create function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      // console.log(req.file);

      // upload photo & create thumbnail image
      if (!req.file || !req.file.path) {
        res.status(400).send({
          status: false,
          data: 'No File is selected.',
        });
      } else {
        resolutionList.map(res => {
          sharp(req.file.path)
            .resize(res.width, res.height)
            .toFile(`uploads/articles/${res.width}x${res.height}/${req.file.filename}`, (err, resizeImage) => {
              if(err) {
                console.log(err);
              } else {
                console.log(`resize image for ${res.width}x${res.height} resolution success`);
                console.log(resizeImage);
              }
            });
        });
      }

      const body = req.body;
      const slug = slugify(body.title);
      body['slug'] = slug;
      if (req.file && req.file.path) {
        body['photo'] = req.file.filename;
      }

      const article = await articleService.createArticle(body);
      console.log(body);
      res.json({data: article, status: 'success'});
    } catch (err) {
      console.log(err);
      // res.status(500).json({
      //   error: err.message,
      //   line: err.lineNumber,
      // });
    }
  },
];

const getArticlesByQuery = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    if(Object.keys(body).length === 0) {
      
    }

    const articles = await articleService.getArticlesByQuery(req.query.q, body);
    if (articles) {
      res.json({data: articles, status: 'success'});
    }
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getArticlesTestQuery = async (req, res) => {
  try {
    const articles = await articleService.testQuery1(req.query.q);
    if (articles) {
      res.json({data: articles, status: 'success'});
    }
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (article) {
      res.json({data: article, status: 'success'});
    } else {
      res.status(404).json({error: 'Data not found'});
    }
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const article = await articleService.getArticleBySlug(req.params.id);
    if (article) {
      res.json({data: article, status: 'success'});
    } else {
      res.status(404).json({error: 'Data not found'});
    }
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const updateArticle = [
  // upload photo
  multer({
    storage: diskStorage,
    fileFilter: fileFilter,
  }).single('photo'),
  // validate data
  [
    body('title').notEmpty().withMessage('Judul harus diisi'),
    body('category').notEmpty().withMessage('Kategori harus diisi'),
    body('content').notEmpty().withMessage('Isi konten harus diisi'),
  ],
  // update function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const detail = await articleService.getArticleById(req.params.id);
      const body = req.body;
      
      // create slug
      const slug = slugify(body.title);

      console.log(req.file);
      console.log(req.file.path);

      // create photo & thumbnail
      if (req.file && req.file.path) {
        if (
          typeof(detail.photo) !== 'undefined'&&
          detail.photo &&
          !detail.photo.includes('fakepath')
        ) {
          fs.unlink(path.join('uploads/articles/', detail.photo), ((err) => {
            if (err) console.log(err);
          }));

          resolutionList.map(res => {
            fs.unlink(path.join(`uploads/articles/${res.width}x${res.height}/`, detail.photo), ((err) => {
              if (err) console.log(err);
            }));

            sharp(req.file.path)
              .resize(res.width, res.height)
              .toFile(`uploads/articles/${res.width}x${res.height}/${req.file.filename}`, (err, resizeImage) => {
                if(err) {
                  console.log(err);
                } else {
                  console.log(`resize image for ${res.width}x${res.height} resolution success`);
                  console.log(resizeImage);
                }
              }); 
          });
        }
      }

      // store additional data
      body['slug'] = slug;
      if (req.file && req.file.path) {
        body['photo'] = req.file.filename;
      }

      const article = await articleService.updateArticle(
        req.params.id,
        body,
      );
      // console.log(req.body);
      res.json({data: article, status: 'success'});
    } catch (err) {
      res.status(500).json({error: err.message, line: err.lineNumber});
    }
  },
];

const deleteArticle = async (req, res) => {
  try {
    const detail = await articleService.getArticleById(req.params.id);

    if (detail.photo !== undefined) {
      // remove photo
      fs.unlink(path.join('uploads/articles', detail.photo), ((err) => {
        if (err) console.log(err);
      }));

      resolutionList.map(res => {
        fs.unlink(path.join(`uploads/articles/${res.width}x${res.height}/`, detail.photo), ((err) => {
          if (err) console.log(err);
        }));
      });
    }

    // remove data
    const article = await articleService.deleteArticle(req.params.id);
    res.json({data: article, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};


// test function
const testUpload = [
  multer({storage: diskStorage}).single('photo'),
  async (req, res) => {
    const file = req.file.path;
    if (!file) {
      res.status(400).send({
        status: false,
        data: 'No File is selected.',
      });
    }
    res.send(file);
  },
];

const testFunc1 = [
  multer({storage: diskStorage}).single('photo'),
  async (req, res) => {
    try {
      if (req.file && req.file.path) {
        //create thumbnail image
        sharp(req.file.path)
        .resize(100, 100)
        .toFile('uploads/tests/thumb/' + req.file.filename, (err, resizeImage) => {
          if(err) {
            console.log(err);
          } else {
            console.log('resize image success');
            console.log(resizeImage);
          }
        }); 
      }
      await res.send(JSON.stringify(req.body));
    } catch (err) {
      res.status(500).json({error: err.message, line: err.lineNumber});
    }
  },
];

module.exports = {
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
  diskStorage,
};
