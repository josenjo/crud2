const express = require('express');
const {
  getAllUsers,
  getUsersSelect,
  getUsersUrl,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  testFunction1,
} = require('../controllers/UserController');

const router = new express.Router();

router.route('/')
    .get(getAllUsers)
    .post(createUser);
router.route('/url')
    .get(getUsersUrl);
router
    .route('/test')
    .get(testFunction1);
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
