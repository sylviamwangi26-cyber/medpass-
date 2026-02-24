// models/triageModel.js

module.exports = {
    create: () =>
        `INSERT INTO triage_vitals (visit_id, temperature, weight, height, blood_pressure, recorded_by) VALUES (?, ?, ?, ?, ?, ?)`,

    getByVisitId: () =>
        `SELECT * FROM triage_vitals WHERE visit_id = ?`,

    getByPatientId: () =>
        `SELECT t.* FROM triage_vitals t 
     JOIN visits v ON t.visit_id = v.id 
     WHERE v.patient_id = ? 
     ORDER BY t.recorded_at DESC`
};
