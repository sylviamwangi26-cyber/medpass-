const express = require('express');
const medPractionerController = require('../controllers/medpractionersController');

const router = express.Router();

// Get all medPractioners
router.get('/', medPractionerController.getAllPractioners);

// Get a single medPractioner by ID
router.get('/:id', medPractionerController.getPractionerById);

// Create a new medPractioner
router.post('/', medPractionerController.createPractioner);

// Update an existing medPractioner by ID
router.put('/:id', medPractionerController.updatePractioner);

// Delete a medPractioner by ID
router.delete('/:id', medPractionerController.deletePractioner);

module.exports = router;

