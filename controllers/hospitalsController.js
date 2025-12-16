// 1. Change 'require' to 'import' and add the mandatory .js extension
import db from '../config/db.js';
import Hospitals from '../models/hospitalsModels.js';

// 2. Change 'exports.functionName' to 'export const functionName'

export const getAllHospitals = (req, res) => {
  db.query(Hospitals.getAll(), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getHospitalById = (req, res) => {
  const { id } = req.params;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Hospitals.getById(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: 'Hospital not found' });
    res.json(result[0]);
  });
};

export const createHospital = (req, res) => {
  const { name, location } = req.body;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Hospitals.create(name, location), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name, location });
  });
};

export const updateHospital = (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Hospitals.update(id, name, location), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Hospital updated successfully' });
  });
};

export const deleteHospital = (req, res) => {
  const { id } = req.params;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Hospitals.delete(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Hospital deleted successfully' });
  });
};