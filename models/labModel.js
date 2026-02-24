// models/labModel.js

module.exports = {
  create: () =>
    `INSERT INTO lab_records (visit_id, patient_id, test_name, results, status, lab_tech_id) VALUES (?, ?, ?, ?, ?, ?)`,

  update: () =>
    `UPDATE lab_records SET results = ?, status = ? WHERE id = ?`,

  getByPatientId: () =>
    `SELECT * FROM lab_records WHERE patient_id = ? ORDER BY created_at DESC`,

  getByVisitId: () =>
    `SELECT * FROM lab_records WHERE visit_id = ?`
};