// controllers/pharmacyController.js
const db = require('../config/db');

module.exports = {
    // Pharmacy: View pending prescriptions (from pharmacy_records)
    getPendingPrescriptions: (req, res) => {
        const sql = `SELECT pr.*, p.name as patient_name 
                     FROM pharmacy_records pr
                     JOIN patients p ON pr.patient_id = p.id
                     WHERE pr.status = 'Pending'`;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // Pharmacy: Update medication status
    updateMedStatus: (req, res) => {
        const { id } = req.params;
        const { status, pharmacist_id, notes } = req.body; // Status: Dispensed, Not Found, Suggested Elsewhere
        const sql = `UPDATE pharmacy_records SET status = ?, pharmacist_id = ?, prescription_notes = ? WHERE id = ?`;
        db.query(sql, [status, pharmacist_id, notes || null, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // If dispensed, trigger billing
            if (status === 'Dispensed') {
                const billingSql = `INSERT INTO billing (visit_id, description, amount, status, billing_type)
                                    SELECT visit_id, 'Medication Dispensed', 500, 'Pending', 
                                    (SELECT IF(p.medpass_plan IS NOT NULL, 'Medpass', 'Cash') 
                                     FROM patients p 
                                     JOIN visits v ON p.id = v.patient_id 
                                     JOIN pharmacy_records pr ON v.id = pr.visit_id 
                                     WHERE pr.id = ?)
                                    FROM pharmacy_records WHERE id = ?`;
                db.query(billingSql, [id, id], (billErr) => {
                    if (billErr) console.error("Billing Trigger Error:", billErr);
                });
            }

            res.json({ message: "Status updated successfully" });
        });
    }
};
