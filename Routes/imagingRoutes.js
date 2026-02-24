// Routes/imagingRoutes.js
const express = require('express');
const imagingController = require('../controllers/imagingController');
const router = express.Router();

router.post('/request', imagingController.requestImaging);
router.get('/pending', imagingController.getPendingScans);
router.put('/:id/upload', imagingController.submitScanResults);
router.get('/patient/:patientId', imagingController.getPatientImaging);

module.exports = router;
