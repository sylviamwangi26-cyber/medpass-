import express from 'express';
import * as hospitalsController from '../controllers/hospitalsController.js'; // Note the .js extension and '* as'

const router = express.Router();

router.get('/', hospitalsController.getAllHospitals);
router.get('/:id', hospitalsController.getHospitalById);
router.post('/', hospitalsController.createHospital);
router.put('/:id', hospitalsController.updateHospital);
router.delete('/:id', hospitalsController.deleteHospital);

// Change 'module.exports = router;' to 'export default router;'
export default router;