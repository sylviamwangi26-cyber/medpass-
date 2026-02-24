// controllers/referralsController.js
const db = require('../config/db');
const Referrals = require('../models/referralsModel');

module.exports = {
    createReferral: (req, res) => {
        const { patient_id, from_hospital_id, to_hospital_id, reason } = req.body;
        db.query(Referrals.create(), [patient_id, from_hospital_id, to_hospital_id, reason], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Award 100 MPC to patient for referral
            db.query(`UPDATE patients SET medpass_credits = medpass_credits + 100 WHERE id = ?`, [patient_id]);

            res.status(201).json({ message: "Referral created successfully. +100 MedPass Credits Awarded!", referralId: result.insertId });
        });
    },
    getHospitalReferrals: (req, res) => {
        const { hospitalId } = req.params;
        db.query(Referrals.getByHospital(), [hospitalId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },
    updateReferralStatus: (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        db.query(Referrals.updateStatus(), [status, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Referral status updated" });
        });
    }
};
