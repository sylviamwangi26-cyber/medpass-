// controllers/billingController.js

// 1. Use 'require' for CommonJS modules
const db = require('../config/db');
// FIX: Change 'billingModels' (PLURAL) to 'billingModel' (SINGULAR)
const Billing = require('../models/billingModel'); 

// 2. Use 'module.exports' to export controller functions

module.exports = {
    getAllBillings: (req, res) => {
        // Safe: No parameters needed for SELECT *
        db.query(Billing.getAll(), (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getBillingById: (req, res) => {
        const { id } = req.params;
        // SECURE FIX: Pass [id] as the second argument (the parameters array)
        db.query(Billing.getById(), [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!result.length) return res.status(404).json({ message: 'Billing record not found' });
            res.json(result[0]);
        });
    },

    createBilling: (req, res) => {
        const { patient_id, amount, description } = req.body;
        // SECURE FIX: Pass all variables as a parameters array
        const params = [patient_id, amount, description];

        db.query(Billing.create(), params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, patient_id, amount, description });
        });
    },

    updateBilling: (req, res) => {
        const { id } = req.params;
        const { amount, description } = req.body;
        // SECURE FIX: Pass [amount, description, id] as the parameters array
        const params = [amount, description, id];

        db.query(Billing.update(), params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Billing updated successfully' });
        });
    },

    deleteBilling: (req, res) => {
        const { id } = req.params;
        // FIX: The model function is named 'remove', not 'delete'
        // SECURE FIX: Pass [id] as the parameters array
        db.query(Billing.remove(), [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Billing deleted successfully' });
        });
    }
};