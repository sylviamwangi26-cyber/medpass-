// routes/triageRoutes.js
const express = require('express');
const triageController = require('../controllers/triageController');
const router = express.Router();

router.post('/record', triageController.recordVitals);
router.get('/:visitId', triageController.getVitalsByVisit);

module.exports = router;
