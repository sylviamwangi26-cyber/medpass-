// controllers/patientsController.js
const db = require('../config/db');
const Patients = require('../models/patientsModel');

module.exports = {
  getAllPatients: (req, res) => {
    const { hospital_id } = req.query;
    let sql = Patients.getAll();
    let params = [];

    if (hospital_id) {
      // Filter patients who have visited this hospital
      sql = `SELECT p.* FROM patients p 
             JOIN visits v ON p.id = v.patient_id 
             WHERE v.hospital_id = ? 
             GROUP BY p.id`;
      params = [hospital_id];
    }

    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getPatientById: (req, res) => {
    const { id } = req.params;
    db.query(Patients.getById(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Patient not found' });
      res.json(result[0]);
    });
  },

  getPatientProfile: (req, res) => {
    const { userId } = req.params;
    const sql = `SELECT p.*, u.email, u.phone FROM patients p JOIN users u ON p.user_id = u.id WHERE u.id = ?`;
    db.query(sql, [userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Profile not found' });

      const patient = result[0];
      const familySql = `SELECT name, unique_id, medpass_plan FROM patients WHERE family_id = ? AND id != ?`;
      db.query(familySql, [patient.family_id, patient.id], (fErr, family) => {
        res.json({ ...patient, familyMembers: family || [] });
      });
    });
  },

  getPatientByUserId: (req, res) => {
    const { userId } = req.params;
    db.query(Patients.getByUserId(), [userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Patient profile not found' });
      res.json(result[0]);
    });
  },

  createPatient: (req, res) => {
    const { unique_id, user_id, name, dob, gender, blood_group, allergies, location, emergency_contact, profile_picture, insurance_type, insurance_id, medpass_plan } = req.body;
    const params = [unique_id, user_id, name, dob, gender, blood_group, allergies, location, emergency_contact, profile_picture, insurance_type, insurance_id, medpass_plan];
    db.query(Patients.create(), params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, unique_id, name });
    });
  },

  updatePatient: (req, res) => {
    const { id } = req.params;
    const { name, dob, gender, blood_group, allergies, location, emergency_contact, profile_picture, insurance_type, insurance_id, medpass_plan } = req.body;
    const params = [name, dob, gender, blood_group, allergies, location, emergency_contact, profile_picture, insurance_type, insurance_id, medpass_plan, id];
    db.query(Patients.update(), params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Patient updated successfully' });
    });
  },

  deletePatient: (req, res) => {
    const { id } = req.params;
    db.query(Patients.remove(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Patient deleted successfully' });
    });
  }
};