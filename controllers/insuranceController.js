// controllers/insuranceController.js
const db = require('../config/db');
const Patients = require('../models/patientsModel');

module.exports = {
    purchasePlan: (req, res) => {
        const { patientId, planType, hospitalId } = req.body; // planType: 'Basic', 'Premium', 'VIP'

        if (!['Basic', 'Premium', 'VIP'].includes(planType)) {
            return res.status(400).json({ error: "Invalid plan type" });
        }

        const query = `UPDATE patients SET medpass_plan = ?, primary_hospital_id = ? WHERE id = ?`;

        db.query(query, [planType, hospitalId || null, patientId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Medpass ${planType} plan purchased successfully!` });
        });
    },

    getInsuranceStatus: (req, res) => {
        const { patientId } = req.params; // This is actually the user_id from sessionStorage
        db.query(Patients.getByUserId(), [patientId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            // If no profile found, return a default 'None' or 'Basic' status gracefully
            if (results.length === 0) {
                return res.json({
                    medpass_plan: 'Basic',
                    insurance_type: 'None',
                    insurance_id: null
                });
            }

            const patient = results[0];
            res.json({
                medpass_plan: patient.medpass_plan || 'Basic',
                insurance_type: patient.insurance_type || 'None',
                insurance_id: patient.insurance_id || null
            });
        });
    }
};
