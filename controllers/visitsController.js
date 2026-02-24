// controllers/visitsController.js
const db = require('../config/db');
const Visits = require('../models/visitsModel');

// Get all visits
module.exports = {
  getAllVisits: (req, res) => {
    db.query(Visits.getAll(), (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getPatientHistory: (req, res) => {
    const { patientId } = req.params;
    const sql = `SELECT v.*, p.name as practitioner_name, h.name as hospital_name 
                 FROM visits v 
                 LEFT JOIN med_practioners p ON v.practitioner_id = p.id
                 LEFT JOIN hospitals h ON v.hospital_id = h.id
                 WHERE v.patient_id = ? ORDER BY v.visit_date DESC`;
    db.query(sql, [patientId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get a single visit by ID
  getVisitById: (req, res) => {
    const { id } = req.params;
    db.query(Visits.getById(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Visit not found' });
      res.json(result[0]);
    });
  },

  // Create a new visit
  createVisit: (req, res) => {
    const { patient_id, practitioner_id, hospital_id, visit_date, notes, referred_from_hospital_id } = req.body;
    const params = [patient_id, practitioner_id, hospital_id, visit_date || new Date(), notes, referred_from_hospital_id || null];
    db.query(Visits.create(), params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, patient_id, practitioner_id, visit_date });
    });
  },

  // Update an existing visit
  updateVisit: (req, res) => {
    const { id } = req.params;
    const { notes, medications, test_results } = req.body;
    db.query(Visits.update(), [notes, medications, test_results, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Visit updated successfully' });
    });
  },

  // Delete a visit
  deleteVisit: (req, res) => {
    const { id } = req.params;
    db.query(Visits.remove(), [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Visit deleted successfully' });
    });
  }
};
