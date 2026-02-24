// Routes/claimsRoutes.js
const express = require('express');
const claimsController = require('../controllers/claimsController');

const router = express.Router();

router.get('/', claimsController.getAllClaims);
router.get('/:id', claimsController.getClaimById);
router.post('/', claimsController.createClaim);
router.put('/:id', claimsController.updateClaim);
router.delete('/:id', claimsController.deleteClaim);

module.exports = router;