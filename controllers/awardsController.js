// controllers/awardsController.js
const db = require('../config/db');

module.exports = {
    getUserAwards: (req, res) => {
        const { userId } = req.params;
        const sql = `SELECT * FROM awards WHERE user_id = ? ORDER BY created_at DESC`;
        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getHospitalAwards: (req, res) => {
        const { hospitalId } = req.params;
        const sql = `SELECT * FROM awards WHERE hospital_id = ? ORDER BY created_at DESC`;
        db.query(sql, [hospitalId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getPatientCredits: (req, res) => {
        const { userId } = req.params;
        const sql = `SELECT medpass_credits FROM patients WHERE user_id = ?`;
        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!results.length) return res.status(404).json({ error: "Patient not found" });
            res.json({ credits: results[0].medpass_credits });
        });
    },

    // Internal helper to add credits
    addCredits: (userId, points, callback) => {
        const sql = `UPDATE patients SET medpass_credits = medpass_credits + ? WHERE user_id = ?`;
        db.query(sql, [points, userId], callback);
    }
};
