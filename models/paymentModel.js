// models/paymentModel.js

module.exports = {
  getAll: () => `SELECT * FROM payment`,
  getById: () => `SELECT * FROM payment WHERE id = ?`,
  create: () => `INSERT INTO payment (patient_id, amount, method) VALUES (?, ?, ?)`,
  update: () => `UPDATE payment SET amount = ?, method = ? WHERE id = ?`,
  remove: () => `DELETE FROM payment WHERE id = ?`
};