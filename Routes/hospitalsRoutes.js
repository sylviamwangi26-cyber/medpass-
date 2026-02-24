// Routes/hospitalsRoutes.js
const express = require('express');
const hospitalsController = require('../controllers/hospitalsController');
const router = express.Router();

router.get('/', hospitalsController.getAllHospitals);
router.get('/:id', hospitalsController.getHospitalById);
router.post('/', hospitalsController.createHospital);
router.put('/:id', hospitalsController.updateHospital);
router.delete('/:id', hospitalsController.deleteHospital);

module.exports = router;