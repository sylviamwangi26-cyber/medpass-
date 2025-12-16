// routes/adminRoutes.js

// FIX: Change 'import' to 'require' for dependencies
const express = require("express");

// FIX: Change 'import * as ...' to 'require(...)'
// When using require, the controller exports an object containing all functions
const adminController = require('../controllers/adminController'); 

const router = express.Router();

router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.post('/', adminController.createAdmin);
// router.put('/:id', adminController.updateAdmin);
// router.delete('/:id', adminController.deleteAdmin);

// FIX: Change 'export default' to 'module.exports'
module.exports = router;