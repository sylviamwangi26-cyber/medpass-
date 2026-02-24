// Routes/awardsRoutes.js
const express = require('express');
const awardsController = require('../controllers/awardsController');
const router = express.Router();

router.get('/user/:userId', awardsController.getUserAwards);
router.get('/hospital/:hospitalId', awardsController.getHospitalAwards);
router.get('/credits/:userId', awardsController.getPatientCredits);

module.exports = router;
