import express from 'express';
import * as paymentController from '../controllers/paymentController.js'; // Note the .js extension and '* as'

const router = express.Router();

router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

// Change 'module.exports = router;' to 'export default router;'
export default router;