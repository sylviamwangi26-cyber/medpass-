import db from '../config/db.js';
import * as medPractionerModels from '../models/medPractionerModels.js';

// Get all medPractioners
export const getAllPractioners = (req, res) => {
  db.query(medPractionerModels.getAll(), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get a single medPractioner by ID
export const getPractionerById = (req, res) => {
  const { id } = req.params;
  db.query(medPractionerModels.getById(id), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'MedPractioner not found' });
    res.json(results[0]);
  });
};

// Create a new medPractioner
export const createPractioner = (req, res) => {
  const { name, specialization } = req.body;
  if (!name || !specialization) return res.status(400).json({ message: 'Name and specialization required' });

  db.query(medPractionerModels.create(name, specialization), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'MedPractioner created successfully', id: result.insertId });
  });
};

// Update an existing medPractioner
export const updatePractioner = (req, res) => {
  const { id } = req.params;
  const { name, specialization } = req.body;
  if (!name || !specialization) return res.status(400).json({ message: 'Name and specialization required' });

  db.query(medPractionerModels.update(id, name, specialization), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'MedPractioner not found' });
    res.json({ message: 'MedPractioner updated successfully' });
  });
};

// Delete a medPractioner
export const deletePractioner = (req, res) => {
  const { id } = req.params;

  db.query(medPractionerModels.deletePractioner(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'MedPractioner not found' });
    res.json({ message: 'MedPractioner deleted successfully' });
  });
};




