// Routes/labRoutes.js
const express = require('express');
const labController = require('../controllers/labController');
const router = express.Router();

router.post('/request', labController.requestTest);
router.get('/pending', labController.getPendingTests);
router.put('/:id/result', labController.submitResult);

module.exports = router;
