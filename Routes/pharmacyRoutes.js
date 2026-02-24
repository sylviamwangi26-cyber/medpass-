// Routes/pharmacyRoutes.js
const express = require('express');
const pharmacyController = require('../controllers/pharmacyController');
const router = express.Router();

router.get('/prescriptions', pharmacyController.getPendingPrescriptions);
router.put('/:id/status', pharmacyController.updateMedStatus);

module.exports = router;
