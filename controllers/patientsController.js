// Change 'require' to 'import' and add the mandatory .js extension
import db from '../config/db.js';
import Patients from '../models/patientsModels.js';

// Change 'exports.functionName' to 'export const functionName'

export const getAllPatients = (req, res) => {
  // Model should return 'SELECT * FROM patients'
  db.query(Patients.getAll(), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getPatientById = (req, res) => {
  const { id } = req.params;
  // Model should return 'SELECT * FROM patients WHERE id = ?'
  db.query(Patients.getById(), [id], (err, result) => { // Pass [id] for safety
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: 'Patient not found' });
    res.json(result[0]);
  });
};

export const createPatient = (req, res) => {
  const { name, dob, ward, bed_number } = req.body;
  // Model should return 'INSERT INTO patients (...) VALUES (?, ?, ?, ?)'
  db.query(Patients.create(), [name, dob, ward, bed_number], (err, result) => { // Pass values for safety
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name, dob, ward, bed_number });
  });
};

export const updatePatient = (req, res) => {
  const { id } = req.params;
  const { name, dob, ward, bed_number } = req.body;
  // Model should return 'UPDATE patients SET ... WHERE id = ?'
  db.query(Patients.update(), [name, dob, ward, bed_number, id], (err, result) => { // Pass values and ID for safety
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient updated successfully' });
  });
};

export const deletePatient = (req, res) => {
  const { id } = req.params;
  // Renamed the model function to 'remove' to be safer than 'delete'
  // Model should return 'DELETE FROM patients WHERE id = ?'
  db.query(Patients.remove(), [id], (err, result) => { // Pass [id] for safety
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });
  });
};