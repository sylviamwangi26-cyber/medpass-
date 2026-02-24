const express = require('express');
const insuaranceproviderController = require('../controllers/insuaranceproviderController');

const router = express.Router();

router.get('/', insuaranceproviderController.getAllProviders);
router.get('/:id', insuaranceproviderController.getProviderById);
router.post('/', insuaranceproviderController.createProvider);
router.put('/:id', insuaranceproviderController.updateProvider);
router.delete('/:id', insuaranceproviderController.deleteProvider);

module.exports = router;
