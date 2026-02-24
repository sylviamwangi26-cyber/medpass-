// models/pharmacyModel.js

module.exports = {
    create: () =>
        `INSERT INTO pharmacy_records (visit_id, patient_id, medication_name, dosage, prescription_notes, status, pharmacist_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,

    dispense: () =>
        `UPDATE pharmacy_records SET status = 'Dispensed', pharmacist_id = ? WHERE id = ?`,

    getByPatientId: () =>
        `SELECT * FROM pharmacy_records WHERE patient_id = ? ORDER BY created_at DESC`,

    getByVisitId: () =>
        `SELECT * FROM pharmacy_records WHERE visit_id = ?`
};
