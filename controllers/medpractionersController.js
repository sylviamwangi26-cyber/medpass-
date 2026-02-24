const db = require('../config/db');
const medPractionerModels = require('../models/medpractionerModel');

module.exports = {
  getAllPractioners: (req, res) => {
    db.query(medPractionerModels.getAll(), (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getPractionerById: (req, res) => {
    const { id } = req.params;
    db.query(medPractionerModels.getById(), [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'MedPractioner not found' });
      res.json(results[0]);
    });
  },

  createPractioner: (req, res) => {
    const { unique_id, name, specialization, hospital_id } = req.body;
    db.query(medPractionerModels.create(), [unique_id, name, specialization, hospital_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'MedPractioner created successfully', id: result.insertId });
    });
  },

  updatePractioner: (req, res) => {
    const { id } = req.params;
    const { name, specialization, hospital_id } = req.body;
    db.query(medPractionerModels.update(), [name, specialization, hospital_id, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'MedPractioner updated successfully' });
    });
  },

  deletePractioner: (req, res) => {
    const { id } = req.params;
    db.query(medPractionerModels.remove(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'MedPractioner deleted successfully' });
    });
  }
};




