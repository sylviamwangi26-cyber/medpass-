// models/claimsModel.js

module.exports = {
  getAll: () => `SELECT * FROM claims`,
  getById: () => `SELECT * FROM claims WHERE id = ?`,
  create: () => `INSERT INTO claims (patient_id, claim_type, status) VALUES (?, ?, ?)`,
  update: () => `UPDATE claims SET status = ? WHERE id = ?`,
  remove: () => `DELETE FROM claims WHERE id = ?`
};