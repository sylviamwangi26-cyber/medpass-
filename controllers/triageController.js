// controllers/triageController.js
const db = require('../config/db');
const Triage = require('../models/triageModel');

module.exports = {
    recordVitals: (req, res) => {
        const { visit_id, temperature, weight, height, blood_pressure, recorded_by } = req.body;

        const params = [visit_id, temperature, weight, height, blood_pressure, recorded_by];

        db.query(Triage.create(), params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Vitals recorded successfully", id: result.insertId });
        });
    },

    getVitalsByVisit: (req, res) => {
        const { visitId } = req.params;
        db.query(Triage.getByVisitId(), [visitId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results[0] || {});
        });
    }
};
