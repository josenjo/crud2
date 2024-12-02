const express = require('express');
const {
  getAllRoles,
  getRolesSelect,
  getRolesUrl,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
} = require('../controllers/RoleController');

const router = new express.Router();

router.route('/')
    .get(getAllRoles)
    .post(createRole);
router.route('/select')
    .get(getRolesSelect);
router.route('/url')
    .get(getRolesUrl);
router
    .route('/:id')
    .get(getRoleById)
    .put(updateRole)
    .delete(deleteRole);

module.exports = router;
