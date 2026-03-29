// controllers/billingController.js
const db = require('../config/db');
const Billing = require('../models/billingModel');

module.exports = {
    getAllBillings: (req, res) => {
        db.query(Billing.getAll(), (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getBillingById: (req, res) => {
        const { id } = req.params;
        db.query(Billing.getById(), [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!result.length) return res.status(404).json({ message: 'Billing record not found' });
            res.json(result[0]);
        });
    },

    createBilling: (req, res) => {
        const { patient_id, visit_id, amount, description, billing_type } = req.body;
        const params = [patient_id, visit_id || null, amount, description, billing_type || 'Cash'];
        const sql = `INSERT INTO billing (patient_id, visit_id, amount, description, billing_type) VALUES (?, ?, ?, ?, ?)`;

        db.query(sql, params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, patient_id, visit_id, amount, description, billing_type });
        });
    },

    updateBilling: (req, res) => {
        const { id } = req.params;
        const { amount, description, status } = req.body;
        const sql = `UPDATE billing SET amount = ?, description = ?, status = ? WHERE id = ?`;
        db.query(sql, [amount, description, status || 'Pending', id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Billing updated successfully' });
        });
    },

    updateStatus: (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const sql = `UPDATE billing SET status = ? WHERE id = ?`;
        db.query(sql, [status, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Status updated to ${status}` });
        });
    },

    getInsuranceBills: (req, res) => {
        const sql = `SELECT b.*, p.name as patient_name 
                     FROM billing b
                     JOIN patients p ON b.patient_id = p.id
                     WHERE b.billing_type = 'Insurance'`;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    payoutHospital: (req, res) => {
        const { hospital_id } = req.body;
        if (!hospital_id) return res.status(400).json({ error: "Hospital ID is required" });

        // SQL to update all 'Billed' records for this hospital to 'Paid'
        const sql = `UPDATE billing b
                     JOIN visits v ON b.visit_id = v.id
                     SET b.status = 'Paid'
                     WHERE v.hospital_id = ? AND b.billing_type = 'Insurance' AND b.status = 'Billed'`;

        db.query(sql, [hospital_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Payout successful. ${result.affectedRows} records updated.`, affectedRows: result.affectedRows });
        });
    },

    deleteBilling: (req, res) => {
        const { id } = req.params;
        db.query(Billing.remove(), [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Billing deleted successfully' });
        });
    }
};