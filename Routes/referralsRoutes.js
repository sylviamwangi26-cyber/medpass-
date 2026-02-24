// Routes/referralsRoutes.js
const express = require('express');
const referralsController = require('../controllers/referralsController');
const router = express.Router();

router.post('/', referralsController.createReferral);
router.get('/hospital/:hospitalId', referralsController.getHospitalReferrals);
router.put('/:id/status', referralsController.updateReferralStatus);

module.exports = router;
