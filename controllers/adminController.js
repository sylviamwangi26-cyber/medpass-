// controllers/adminController.js

// 1. FIX: Use 'require' instead of 'import'
const db = require('../config/db');
// 2. FIX: Use 'require' and load the module object
const Admin = require('../models/adminModel'); 

// 3. FIX: Use 'module.exports' to export all controller functions
module.exports = {
    getAllAdmins: (req, res) => {
        db.query(Admin.getAll(), (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getAdminById: (req, res) => {
        const { id } = req.params;
        console.log(id);
        // SECURE FIX: Pass [id] as the separate parameters array
        db.query(Admin.getById(), [id], (err, result) => { 
            if (err) return res.status(500).json({ error: err.message });
            if (!result.length) return res.status(404).json({ message: 'Admin not found' });
            res.json(result[0]);
        });
    },

    createAdmin: (req, res) => {
        const { full_name, email, password } = req.body;
        // SECURE FIX: Pass parameters as a separate array
        const params = [full_name, email, password];
        
        db.query(Admin.create(), params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, full_name, email, password });
        });
    },

    // Added for completeness and consistency
    updateAdmin: (req, res) => {
        const { id } = req.params;
        const { full_name, email, password } = req.body;
        // SECURE FIX: Ensure parameters are in the correct order for the SQL query
        const params = [full_name, email, password, id]; 

        db.query(Admin.update(), params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Admin updated successfully' });
        });
    },

    // Using 'removeAdmin' to match the 'billingController' pattern
    deleteAdmin: (req, res) => {
        const { id } = req.params;
        // SECURE FIX: Pass [id] as the separate parameters array
        db.query(Admin.remove(), [id], (err, result) => { 
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Admin not found' });
            res.json({ message: 'Admin deleted successfully' });
        });
    }
};