const {body, validationResult} = require('express-validator');
const {slugify} = require('../helpers/MainHelper');
const userService = require('../services/UserService');
const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// init storage & file filter
const diskStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join('./', 'uploads/users'));
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
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({data: users, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getUsersUrl = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const usersUrl = [];

    users.map((res) => {
      usersUrl.push(res.slug);
    });
    res.json({data: usersUrl, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const createUser = [
  // upload photo
  multer({
    storage: diskStorage,
    fileFilter: fileFilter,
  }).single('photo'),
  // validate data
  [
    body('name').notEmpty().withMessage('Nama harus diisi'),
    body('email').notEmpty().withMessage('Email harus diisi'),
    body('password').notEmpty().withMessage('Kata sandi harus diisi'),
    body('description').notEmpty().withMessage('Deskripsi harus diisi'),
  ],
  // create function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      // upload photo
      if (!req.file || !req.file.path) {
        res.status(400).send({
          status: false,
          data: 'No File is selected.',
        });
      } else {
        console.log('image object');
        console.log(req.file);
        //create thumbnail image
        sharp(req.file.path)
          .resize(100, 100)
          .toFile('uploads/users/100x100/' + req.file.filename, (err, resizeImage) => {
            if(err) {
              console.log(err);
            } else {
              console.log('resize image success');
              console.log(resizeImage);
            }
          });
      }

      const body = req.body;

      // create slug
      const slug = slugify(body.name);

      // create password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.password, salt);

      // store additional data
      body['slug'] = slug;
      body['password'] = password;
      if (req.file && req.file.path) {
        body['photo'] = req.file.filename;
      }

      const user = await userService.createUser(body);
      console.log(body);
      res.json({data: user, status: 'success'});
    } catch (err) {
      console.log(err);
      res.status(500).json({error: err.message});
    }
  },
];

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({data: user, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const updateUser = [
  // upload photo
  multer({
    storage: diskStorage,
    fileFilter: fileFilter,
  }).single('photo'),
  // validate data
  [
    body('name').notEmpty().withMessage('Nama harus diisi'),
    body('email').notEmpty().withMessage('Email harus diisi'),
    body('password').notEmpty().withMessage('Kata sandi harus diisi'),
    body('description').notEmpty().withMessage('Deskripsi harus diisi'),
  ],
  // update function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const detail = await userService.getUserById(req.params.id);
      const body = req.body;

      // create slug
      const slug = slugify(body.name);

      // create password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.password, salt);

      // create photo & thumbnail
      if (req.file && req.file.path) {
        if (
          typeof(detail.photo) !== 'undefined'&&
          detail.photo &&
          !detail.photo.includes('fakepath')
        ) {
          fs.unlink(path.join('uploads/users/', detail.photo), ((err) => {
            if (err) console.log(err);
          }));
          fs.unlink(path.join('uploads/users/100x100/', detail.photo), ((err) => {
            if (err) console.log(err);
          }));

          //create thumbnail image
          sharp(req.file.path)
            .resize(100, 100)
            .toFile('uploads/users/100x100/' + req.file.filename, (err, resizeImage) => {
              if(err) {
                console.log(err);
              } else {
                console.log('resize image success');
                console.log(resizeImage);
              }
            }); 
        }
        // const file = req.file.filename;
      }

      // store additional data
      body['slug'] = slug;
      body['password'] = password;
      if (req.file && req.file.path) {
        body['photo'] = req.file.filename;
      }
      

      const user = await userService.updateUser(
        req.params.id,
        body,
      );
      console.log(body);
      res.json({data: user, status: 'success'});
    } catch (err) {
      res.status(500).json({error: err.message, line: err.lineNumber});
    }
  },
];

const deleteUser = async (req, res) => {
  try {
    if (detail.photo !== undefined) {
      fs.unlink(path.join('uploads/users/', detail.photo), ((err) => {
        if (err) console.log(err);
      }));
      fs.unlink(path.join('uploads/users/100x100/', detail.photo), ((err) => {
        if (err) console.log(err);
      }));
    }

    const user = await userService.deleteUser(req.params.id);
    res.json({data: user, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const testFunction1 = async(req, res) => {
  try {
    const password = 'admin';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    res.json({result: hashedPassword, status: 'success'})
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

module.exports = {
  getAllUsers,
  // getUsersSelect,
  getUsersUrl,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  testFunction1
};
