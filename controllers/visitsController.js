import db from '../config/db.js';
import Visits from '../models/visitsModel.js';

// Get all visits
export const getAllVisits = (req, res) => {
  db.query(Visits.getAll(), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get a single visit by ID
export const getVisitById = (req, res) => {
  const { id } = req.params;
  db.query(Visits.getById(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: 'Visit not found' });
    res.json(result[0]);
  });
};

// Create a new visit
export const createVisit = (req, res) => {
  const { patient_id, practitioner_id, visit_date, notes } = req.body;
  db.query(Visits.create(patient_id, practitioner_id, visit_date, notes), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: result.insertId,
      patient_id,
      practitioner_id,
      visit_date,
      notes
    });
  });
};

// Update an existing visit
export const updateVisit = (req, res) => {
  const { id } = req.params;
  const { visit_date, notes } = req.body;
  db.query(Visits.update(id, visit_date, notes), (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Visit updated successfully' });
  });
};

// Delete a visit
export const deleteVisit = (req, res) => {
  const { id } = req.params;
  db.query(Visits.delete(id), (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Visit deleted successfully' });
  });
};
