import express from 'express';
import * as claimsController from '../controllers/claimsController.js'; // Note the .js extension and '* as'

const router = express.Router();

router.get('/', claimsController.getAllClaims);
router.get('/:id', claimsController.getClaimById);
router.post('/', claimsController.createClaim);
router.put('/:id', claimsController.updateClaim);
router.delete('/:id', claimsController.deleteClaim);

// Change 'module.exports = router;' to 'export default router;'
export default router;