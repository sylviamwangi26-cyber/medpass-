// models/insuaranceproviderModel.js

module.exports = {
  getAll: () => `SELECT * FROM insurance_provider`,
  getById: () => `SELECT * FROM insurance_provider WHERE id = ?`,
  create: () => `INSERT INTO insurance_provider (name, contact) VALUES (?, ?)`,
  update: () => `UPDATE insurance_provider SET name = ?, contact = ? WHERE id = ?`,
  remove: () => `DELETE FROM insurance_provider WHERE id = ?`
};