import express from 'express';
import * as insuaranceproviderController from '../controllers/insuaranceproviderController.js';

const router = express.Router();

router.get('/', insuaranceproviderController.getAllProviders);
router.get('/:id', insuaranceproviderController.getProviderById);
router.post('/', insuaranceproviderController.createProvider);
router.put('/:id', insuaranceproviderController.updateProvider);
router.delete('/:id', insuaranceproviderController.deleteProvider);

export default router;
