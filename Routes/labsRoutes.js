import express from 'express';
import * as labsController from '../controllers/labsController.js'; // Note the .js extension and '* as'

const router = express.Router();

router.get('/', labsController.getAllLabs);
router.get('/:id', labsController.getLabById);
router.post('/', labsController.createLab);
router.put('/:id', labsController.updateLab);
router.delete('/:id', labsController.deleteLab);

// Change 'module.exports = router;' to 'export default router;'
export default router;