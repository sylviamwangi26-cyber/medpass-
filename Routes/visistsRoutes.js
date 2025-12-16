import express from 'express';
import * as visitsController from '../controllers/visitsController.js'; // Note the .js extension and '* as'

const router = express.Router();

router.get('/', visitsController.getAllVisits);
router.get('/:id', visitsController.getVisitById);
router.post('/', visitsController.createVisit);
router.put('/:id', visitsController.updateVisit);
router.delete('/:id', visitsController.deleteVisit);

// Change 'module.exports = router;' to 'export default router;'
export default router;