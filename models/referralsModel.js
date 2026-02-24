// models/referralsModel.js
module.exports = {
    create: () => `INSERT INTO referrals (patient_id, from_hospital_id, to_hospital_id, reason, status) VALUES (?, ?, ?, ?, 'Pending')`,
    getByHospital: () => `SELECT r.*, p.name as patient_name, h.name as from_hospital_name 
                        FROM referrals r 
                        JOIN patients p ON r.patient_id = p.id 
                        JOIN hospitals h ON r.from_hospital_id = h.id 
                        WHERE r.to_hospital_id = ?`,
    updateStatus: () => `UPDATE referrals SET status = ? WHERE id = ?`
};
