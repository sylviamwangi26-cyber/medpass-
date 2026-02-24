// controllers/labController.js
const db = require('../config/db');

module.exports = {
    // Doctor: Request a test
    requestTest: (req, res) => {
        const { visit_id, patient_id, test_name } = req.body;
        if (!patient_id || !test_name) {
            return res.status(400).json({ error: "Patient ID and Test Name required" });
        }
        const sql = `INSERT INTO lab_records (visit_id, patient_id, test_name, status) VALUES (?, ?, ?, 'Pending')`;
        db.query(sql, [visit_id || null, patient_id, test_name], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Lab test requested", id: result.insertId });
        });
    },

    // Lab: View pending tests
    getPendingTests: (req, res) => {
        const sql = `SELECT l.*, p.name as patient_name, h.name as hospital_name 
                     FROM lab_records l
                     JOIN patients p ON l.patient_id = p.id
                     LEFT JOIN visits v ON l.visit_id = v.id
                     LEFT JOIN hospitals h ON v.hospital_id = h.id
                     WHERE l.status = 'Pending'`;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // Lab: Submit result
    submitResult: (req, res) => {
        const { id } = req.params;
        const { results, lab_tech_id } = req.body;
        const sql = `UPDATE lab_records SET results = ?, status = 'Completed', lab_tech_id = ? WHERE id = ?`;
        db.query(sql, [results, lab_tech_id, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Award 50 MPC to patient
            const awardSql = `UPDATE patients SET medpass_credits = medpass_credits + 50 
                              WHERE id = (SELECT patient_id FROM lab_records WHERE id = ?)`;
            db.query(awardSql, [id]);

            // Trigger Billing
            const billingSql = `INSERT INTO billing (visit_id, description, amount, status, billing_type)
                                SELECT visit_id, CONCAT('Lab Result: ', test_name), 800, 'Pending', 
                                (SELECT IF(p.medpass_plan IS NOT NULL, 'Medpass', 'Cash') 
                                 FROM patients p 
                                 JOIN visits v ON p.id = v.patient_id 
                                 JOIN lab_records lr ON v.id = lr.visit_id 
                                 WHERE lr.id = ?)
                                FROM lab_records WHERE id = ?`;
            db.query(billingSql, [id, id], (billErr) => {
                if (billErr) console.error("Lab Billing Error:", billErr);
            });

            // Send SMS
            const smsQuery = `SELECT p.name, u.phone, l.test_name FROM lab_records l JOIN patients p ON l.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE l.id = ?`;
            db.query(smsQuery, [id], (sErr, sRes) => {
                if (!sErr && sRes[0]) {
                    const SMS = require('../services/SMSService');
                    SMS.sendResultNotification(sRes[0].name, sRes[0].phone, sRes[0].test_name);
                }
            });

            res.json({ message: "Lab results submitted. +50 MedPass Credits Awarded!" });
        });
    }
};
