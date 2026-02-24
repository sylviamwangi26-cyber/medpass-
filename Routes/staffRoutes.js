const express = require('express');
const staffController = require('../controllers/staffController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(restrictTo('hospital', 'medpassadmin', 'admin'));

router.post('/add', staffController.addStaff);
router.get('/hospital/:hospitalId', staffController.getHospitalStaff);
router.delete('/:staffId', staffController.removeStaff);

module.exports = router;
