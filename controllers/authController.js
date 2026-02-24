const User = require('../models/userModel');
const Practitioners = require('../models/medpractionerModel');
const db = require('../config/db');
const SMS = require('../services/smsService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateUniqueId = (role) => {
    const prefix = role.toUpperCase().substring(0, 3);
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `MP-${prefix}-${random}`;
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, unique_id: user.unique_id, role: user.role, hospital_id: user.hospital_id },
        process.env.JWT_SECRET || 'medpass_secret_key_2026',
        { expiresIn: '24h' }
    );
};

module.exports = {
    register: async (req, res) => {
        const { full_name, email, phone, password, role, hospital_id, language_preference } = req.body;

        if (!full_name || !email || !password || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const uniqueId = generateUniqueId(role);
            const lang = language_preference || 'EN';

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userParams = [uniqueId, full_name, email, phone || null, hashedPassword, role, hospital_id || null, lang];
            const userSQL = User.create();

            db.query(userSQL, userParams, (err, result) => {
                if (err) {
                    console.error("User creation error:", err.message);
                    return res.status(500).json({ error: "Failed to create user: " + err.message });
                }

                const userId = result.insertId;

                // Create specific role entries
                if (role === 'patient') {
                    const { dob, gender, blood_group, allergies, location, emergency_contact, medpass_plan, family_id, national_id, primary_hospital_id, preferred_doctor_name } = req.body;
                    const patientParams = [
                        uniqueId, userId, family_id || uniqueId.replace('MP-PAT', 'MP-FAM'), full_name, dob || null, gender || null,
                        blood_group || null, allergies || null, location || null, phone || null,
                        emergency_contact || null, null, null, null, medpass_plan || 'None',
                        national_id || null, primary_hospital_id || null, preferred_doctor_name || null
                    ];
                    const patientSQL = `INSERT INTO patients (unique_id, user_id, family_id, name, dob, gender, blood_group, allergies, location, phone, emergency_contact, profile_picture, insurance_type, insurance_id, medpass_plan, national_id, primary_hospital_id, preferred_doctor_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    db.query(patientSQL, patientParams, (pErr) => {
                        if (pErr) console.error("Error creating patient profile:", pErr.message);
                    });
                } else if (['doctor', 'nurse', 'lab', 'radiologist', 'pharmacy', 'receptionist', 'accounts'].includes(role)) {
                    const { specialization } = req.body;
                    const spec = specialization || 'General';
                    const practitionerParams = [uniqueId, userId, full_name, spec, hospital_id];
                    db.query(Practitioners.create(), practitionerParams, (prErr) => {
                        if (prErr) console.error("Error creating practitioner profile:", prErr.message);
                    });
                } else if (role === 'hospital') {
                    const { location, num_doctors, num_nurses, num_wards, has_maternity, has_theatre, has_radiology, has_lab, has_pharmacy, has_account } = req.body;
                    const hospitalSQL = `INSERT INTO hospitals (unique_id, name, location, email, password, num_doctors, num_nurses, num_wards, has_maternity, has_theatre, has_radiology, has_lab, has_pharmacy, has_account) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    db.query(hospitalSQL, [
                        uniqueId, full_name, location || 'Unknown', email, hashedPassword,
                        num_doctors || 0, num_nurses || 0, num_wards || 0,
                        has_maternity === true || has_maternity === 'true',
                        has_theatre === true || has_theatre === 'true',
                        has_radiology === true || has_radiology === 'true',
                        has_lab === true || has_lab === 'true',
                        has_pharmacy === true || has_pharmacy === 'true',
                        has_account === true || has_account === 'true'
                    ], (hErr, hResult) => {
                        if (hErr) {
                            console.error("Error creating hospital profile:", hErr.message);
                        } else {
                            // Link the user to the hospital they just created
                            const hospitalId = hResult.insertId;
                            db.query(`UPDATE users SET hospital_id = ? WHERE id = ?`, [hospitalId, userId], (uErr) => {
                                if (uErr) console.error("Error linking hospital to user:", uErr.message);
                            });
                        }
                    });
                }

                if (role === 'patient' && phone) {
                    console.log(`\n\x1b[35m[SYSTEM] Onboarding Patient: ${full_name}...\x1b[0m`);
                    SMS.sendWelcomeMessage(full_name, phone, uniqueId, lang);
                }

                res.status(201).json({ message: "User registered successfully", unique_id: uniqueId, user_id: userId });
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updatePassword: async (req, res) => {
        const { userId, oldPassword, newPassword } = req.body;
        if (!userId || !oldPassword || !newPassword) return res.status(400).json({ error: "Missing fields" });

        db.query(`SELECT password FROM users WHERE id = ?`, [userId], async (err, results) => {
            if (err || results.length === 0) return res.status(500).json({ error: "User not found" });

            // Check if old password matches (either hashed or legacy 'CHANGE_ME')
            const isMatch = await bcrypt.compare(oldPassword, results[0].password);
            const isLegacy = (oldPassword === results[0].password);

            if (!isMatch && !isLegacy) {
                return res.status(401).json({ error: "Incorrect old password" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            db.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId], (upErr) => {
                if (upErr) return res.status(500).json({ error: upErr.message });
                res.json({ message: "Password updated successfully" });
            });
        });
    },

    login: (req, res) => {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: "Identifier and password required" });
        }

        const sql = `SELECT * FROM users WHERE email = ? OR unique_id = ?`;
        db.query(sql, [identifier, identifier], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(401).json({ error: "User not found" });

            const user = results[0];

            // Check password (hash or plain-text legacy support)
            const isMatch = await bcrypt.compare(password, user.password);
            const isLegacyMatch = (password === user.password);

            if (!isMatch && !isLegacyMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const needsPasswordReset = (user.password === 'CHANGE_ME');
            const token = generateToken(user);

            res.json({
                message: "Login successful",
                token,
                needsPasswordReset,
                user: {
                    id: user.id,
                    unique_id: user.unique_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    hospital_id: user.hospital_id
                }
            });
        });
    },

    getProfile: (req, res) => {
        const { userId } = req.params;
        db.query(`SELECT * FROM users WHERE id = ?`, [userId], (err, results) => {
            if (err || results.length === 0) return res.status(404).json({ error: "User not found" });
            const user = results[0];
            delete user.password;
            res.json(user);
        });
    }
};
