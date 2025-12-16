// 1. Change 'require' to 'import' and add the mandatory .js extension for local files
import db from '../config/db.js';
import Claims from '../models/claimsModels.js';

// 2. Change 'exports.functionName' to 'export const functionName'

export const getAllClaims = (req, res) => {
  db.query(Claims.getAll(), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getClaimById = (req, res) => {
  const { id } = req.params;
  db.query(Claims.getById(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: 'Claim not found' });
    res.json(result[0]);
  });
};

export const createClaim = (req, res) => {
  const { patient_id, claim_type, status } = req.body;
  // ⚠️ SECURITY WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Claims.create(patient_id, claim_type, status), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, patient_id, claim_type, status });
  });
};

export const updateClaim = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // ⚠️ SECURITY WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Claims.update(id, status), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Claim updated successfully' });
  });
};

export const deleteClaim = (req, res) => {
  const { id } = req.params;
  // ⚠️ SECURITY WARNING: Use parameterized queries to prevent SQL Injection
  db.query(Claims.delete(id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Claim deleted successfully' });
  });
};