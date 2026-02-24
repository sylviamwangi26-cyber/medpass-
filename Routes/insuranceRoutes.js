// routes/insuranceRoutes.js
const express = require('express');
const insuranceController = require('../controllers/insuranceController');
const router = express.Router();

router.post('/purchase', insuranceController.purchasePlan);
router.get('/status/:patientId', insuranceController.getInsuranceStatus);

module.exports = router;
