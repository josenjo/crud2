const {body, validationResult} = require('express-validator');
const {slugify} = require('../helpers/MainHelper');
const roleService = require('../services/RoleService');

const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json({data: roles, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getRolesSelect = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    const rolesSelect = [];

    roles.map((res) => {
      rolesSelect.push({label: res.name, value: res._id});
    });
    res.json({data: rolesSelect, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const getRolesUrl = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    const rolesUrl = [];

    roles.map((res) => {
      rolesUrl.push(res.slug);
    });
    res.json({data: rolesUrl, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const createRole = [
  // validate data
  [
    body('name').notEmpty().withMessage('Nama harus diisi'),
  ],
  // create function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const body = req.body;
      const role = await roleService.createRole(body);
      console.log(body);
      res.json({data: role, status: 'success'});
    } catch (err) {
      console.log(err);
      res.status(500).json({error: err.message});
    }
  },
];

const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.json({data: role, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

const updateRole = [
  // validate data
  [
    body('name').notEmpty().withMessage('Nama harus diisi'),
  ],
  // update function
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const role = await roleService.updateRole(
          req.params.id,
          req.body,
      );
      console.log(req.body);
      res.json({data: role, status: 'success'});
    } catch (err) {
      res.status(500).json({error: err.message, line: err.lineNumber});
    }
  },
];

const deleteRole = async (req, res) => {
  try {
    const role = await roleService.deleteRole(req.params.id);
    res.json({data: role, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

module.exports = {
  getAllRoles,
  getRolesSelect,
  getRolesUrl,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
};
