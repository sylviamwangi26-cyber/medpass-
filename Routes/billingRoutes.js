// routes/billingRoutes.js

// FIX: Change 'import' to 'require' for dependencies
const express = require("express");

// FIX: Change 'import * as ...' to 'require(...)'
// Require the billing controller object containing all exported functions
const billingController = require('../controllers/billingController'); 

const router = express.Router();

// Route mappings using the imported controller functions
router.get('/', billingController.getAllBillings);
router.get('/:id', billingController.getBillingById);
router.post('/', billingController.createBilling);
router.put('/:id', billingController.updateBilling);
router.delete('/:id', billingController.deleteBilling);

// FIX: Change 'export default' to 'module.exports'
module.exports = router;