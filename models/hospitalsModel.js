// models/hospitalsModel.js
const db = require('../config/db');

module.exports = {
  getAll: () => `SELECT * FROM hospitals`,
  getById: () => `SELECT * FROM hospitals WHERE id = ?`,
  create: () => `INSERT INTO hospitals (name, location) VALUES (?, ?)`,
  update: () => `UPDATE hospitals SET name = ?, location = ? WHERE id = ?`,
  remove: () => `DELETE FROM hospitals WHERE id = ?`
};