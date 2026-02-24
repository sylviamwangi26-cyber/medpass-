// controllers/imagingController.js
const db = require('../config/db');

module.exports = {
    // Request an imaging test (X-Ray, MRI, etc.)
    requestImaging: (req, res) => {
        const { visit_id, patient_id, imaging_type, description } = req.body;
        if (!patient_id || !imaging_type) {
            return res.status(400).json({ error: "Patient ID and Imaging Type required" });
        }
        const sql = `INSERT INTO imaging_records (visit_id, patient_id, imaging_type, description, status) VALUES (?, ?, ?, ?, 'Pending')`;
        db.query(sql, [visit_id || null, patient_id, imaging_type, description], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Imaging request created", id: result.insertId });
        });
    },

    // Get pending imaging tasks
    getPendingScans: (req, res) => {
        const sql = `SELECT i.*, p.name as patient_name 
                     FROM imaging_records i
                     JOIN patients p ON i.patient_id = p.id
                     WHERE i.status = 'Pending'`;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // Upload scan results (Image URL + Findings)
    submitScanResults: (req, res) => {
        const { id } = req.params;
        const { image_url, results, technician_id } = req.body;
        const sql = `UPDATE imaging_records SET image_url = ?, results = ?, status = 'Completed', technician_id = ? WHERE id = ?`;
        db.query(sql, [image_url, results, technician_id, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Imaging results submitted successfully" });
        });
    },

    // Get imaging history for a specific patient
    getPatientImaging: (req, res) => {
        const { patientId } = req.params;
        const sql = `SELECT * FROM imaging_records WHERE patient_id = ? ORDER BY created_at DESC`;
        db.query(sql, [patientId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};
