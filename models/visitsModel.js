// models/visitsModel.js

module.exports = {
  getAll: () => `SELECT * FROM visits`,

  // SAFE: Controller passes ID separately: db.query(getById(), [id], ...)
  getById: () => `SELECT * FROM visits WHERE id = ?`,

  getByPatientId: () => `SELECT * FROM visits WHERE patient_id = ? ORDER BY visit_date DESC`,

  // SAFE: Controller passes values separately: db.query(create(), [patient_id, practitioner_id, hospital_id, visit_date, notes, referred_from_hospital_id], ...)
  create: () =>
    `INSERT INTO visits (patient_id, practitioner_id, hospital_id, visit_date, notes, referred_from_hospital_id) VALUES (?, ?, ?, ?, ?, ?)`,

  // SAFE: Controller passes values and ID separately: db.query(update(), [notes, medications, test_results, id], ...)
  update: () =>
    `UPDATE visits SET notes = ?, medications = ?, test_results = ? WHERE id = ?`,

  // Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
  // SAFE: Controller passes ID separately: db.query(remove(), [id], ...)
  remove: () => `DELETE FROM visits WHERE id = ?`
};