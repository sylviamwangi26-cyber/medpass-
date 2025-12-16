// Change 'require' to 'import' and add the mandatory .js extension
import db from '../config/db.js';
import Labs from '../models/labsModels.js';

// Change 'exports.functionName' to 'export const functionName'

export const getAllLabs = (req, res) => {
  db.query(Labs.getAll(), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getLabById = (req, res) => {
  const { id } = req.params;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Labs.getById(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: 'Lab not found' });
    res.json(result[0]);
  });
};

export const createLab = (req, res) => {
  const { name, location } = req.body;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Labs.create(name, location), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name, location });
  });
};

export const updateLab = (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Labs.update(id, name, location), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lab updated successfully' });
  });
};

export const deleteLab = (req, res) => {
  const { id } = req.params;
  // ⚠️ WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Labs.delete(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lab deleted successfully' });
  });
};