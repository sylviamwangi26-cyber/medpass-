// Routes/statsRoutes.js
const express = require('express');
const statsController = require('../controllers/statsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/hospital/:hospitalId', restrictTo('hospital', 'medpassadmin', 'admin'), statsController.getHospitalStats);
router.get('/admin', restrictTo('medpassadmin', 'admin'), statsController.getAdminStats);

module.exports = router;
