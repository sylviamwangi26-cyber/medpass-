// routes/billingRoutes.js

// FIX: Change 'import' to 'require' for dependencies
const express = require("express");

// FIX: Change 'import * as ...' to 'require(...)'
// Require the billing controller object containing all exported functions
const billingController = require('../controllers/billingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Route mappings using the imported controller functions
router.get('/', restrictTo('medpassadmin', 'admin'), billingController.getAllBillings);
router.get('/insurance', billingController.getInsuranceBills);
router.get('/:id', billingController.getBillingById);
router.post('/', billingController.createBilling);
router.put('/:id', billingController.updateBilling);
router.patch('/:id/status', billingController.updateStatus);
router.delete('/:id', billingController.deleteBilling);

// FIX: Change 'export default' to 'module.exports'
module.exports = router;