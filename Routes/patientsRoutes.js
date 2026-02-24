const express = require('express');
const patientsController = require('../controllers/patientsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/', patientsController.getAllPatients);
router.get('/:id', patientsController.getPatientById);
router.get('/user/:userId', patientsController.getPatientByUserId);
router.get('/profile/:userId', patientsController.getPatientProfile);
router.post('/', patientsController.createPatient);
router.put('/:id', patientsController.updatePatient);
router.delete('/:id', patientsController.deletePatient);

module.exports = router;

module.exports = router;