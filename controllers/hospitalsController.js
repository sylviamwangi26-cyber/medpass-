// controllers/hospitalsController.js
const db = require('../config/db');
const Hospitals = require('../models/hospitalsModel');

module.exports = {
  getAllHospitals: (req, res) => {
    db.query(Hospitals.getAll(), (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getHospitalById: (req, res) => {
    const { id } = req.params;
    db.query(Hospitals.getById(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Hospital not found' });
      res.json(result[0]);
    });
  },

  createHospital: (req, res) => {
    const { name, location } = req.body;
    db.query(Hospitals.create(), [name, location], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name, location });
    });
  },

  updateHospital: (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;
    db.query(Hospitals.update(), [name, location, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Hospital updated successfully' });
    });
  },

  deleteHospital: (req, res) => {
    const { id } = req.params;
    db.query(Hospitals.remove(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Hospital deleted successfully' });
    });
  },

  verifyDirectorKey: (req, res) => {
    const { key } = req.body;
    const validKey = process.env.DIRECTOR_SPECIAL_KEY || '121930';
    if (key === validKey) {
      return res.json({ success: true, message: 'Director access granted' });
    }
    return res.status(403).json({ error: 'Invalid Director Special Key' });
  }
};