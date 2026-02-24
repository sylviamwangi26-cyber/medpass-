// Routes/visitsRoutes.js
const express = require('express');
const visitsController = require('../controllers/visitsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/patient/:patientId', visitsController.getPatientHistory);
router.get('/', visitsController.getAllVisits);
router.get('/:id', visitsController.getVisitById);
router.post('/', visitsController.createVisit);
router.put('/:id', visitsController.updateVisit);
router.delete('/:id', visitsController.deleteVisit);

module.exports = router;
