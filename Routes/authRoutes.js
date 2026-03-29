// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/update-password', authController.updatePassword);
router.post('/update-profile', authController.updateProfile);

module.exports = router;
