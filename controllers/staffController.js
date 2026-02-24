const db = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const generateUniqueId = (role) => {
    const prefix = role.toUpperCase().substring(0, 3);
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `MP-${prefix}-${random}`;
};

module.exports = {
    addStaff: async (req, res) => {
        const { full_name, email, phone, role, hospital_id, specialization } = req.body;

        if (!full_name || !email || !role || !hospital_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const uniqueId = generateUniqueId(role);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('CHANGE_ME', salt);

            const userSQL = `INSERT INTO users (unique_id, full_name, email, phone, password, role, hospital_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const userParams = [uniqueId, full_name, email, phone || null, hashedPassword, role, hospital_id];

            db.query(userSQL, userParams, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                const userId = result.insertId;
                const spec = specialization || 'General';
                const practitionerSQL = `INSERT INTO med_practioners (unique_id, user_id, name, specialization, hospital_id) VALUES (?, ?, ?, ?, ?)`;

                db.query(practitionerSQL, [uniqueId, userId, full_name, spec, hospital_id], (prErr) => {
                    if (prErr) return res.status(500).json({ error: prErr.message });
                    res.status(201).json({ message: "Staff added successfully", unique_id: uniqueId });
                });
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getHospitalStaff: (req, res) => {
        const { hospitalId } = req.params;
        const sql = `SELECT u.id, u.unique_id, u.full_name, u.email, u.role, p.specialization 
                     FROM users u 
                     LEFT JOIN med_practioners p ON u.id = p.user_id 
                     WHERE u.hospital_id = ? AND u.role NOT IN ('hospital', 'patient')`;

        db.query(sql, [hospitalId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    removeStaff: (req, res) => {
        const { staffId } = req.params;
        db.query(`DELETE FROM med_practioners WHERE user_id = ?`, [staffId], (err) => {
            db.query(`DELETE FROM users WHERE id = ?`, [staffId], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ message: "Staff removed successfully" });
            });
        });
    }
};
