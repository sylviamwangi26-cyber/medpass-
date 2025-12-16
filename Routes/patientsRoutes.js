import express from 'express';
import * as patientsController from '../controllers/patientsController.js'; // Note the .js extension and '* as'

const router = express.Router();

router.get('/', patientsController.getAllPatients);
router.get('/:id', patientsController.getPatientById);
router.post('/', patientsController.createPatient);
router.put('/:id', patientsController.updatePatient);
router.delete('/:id', patientsController.deletePatient);

// Change 'module.exports = router;' to 'export default router;'
export default router;