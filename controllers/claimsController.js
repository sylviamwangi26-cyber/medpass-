// controllers/claimsController.js
const db = require('../config/db');
const Claims = require('../models/claimsModel');

module.exports = {
  getAllClaims: (req, res) => {
    db.query(Claims.getAll(), (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getClaimById: (req, res) => {
    const { id } = req.params;
    db.query(Claims.getById(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Claim not found' });
      res.json(result[0]);
    });
  },

  createClaim: (req, res) => {
    const { patient_id, claim_type, status } = req.body;
    db.query(Claims.create(), [patient_id, claim_type, status], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, patient_id, claim_type, status });
    });
  },

  updateClaim: (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query(Claims.update(), [status, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Claim updated successfully' });
    });
  },

  deleteClaim: (req, res) => {
    const { id } = req.params;
    db.query(Claims.remove(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Claim deleted successfully' });
    });
  }
};