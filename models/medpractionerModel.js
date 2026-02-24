// models/medpractionerModel.js

module.exports = {
  getAll: () => `SELECT * FROM med_practioners`,

  getById: () => `SELECT * FROM med_practioners WHERE id = ?`,

  getByUniqueId: () => `SELECT * FROM med_practioners WHERE unique_id = ?`,

  create: () =>
    `INSERT INTO med_practioners (unique_id, user_id, name, specialization, hospital_id) VALUES (?, ?, ?, ?, ?)`,

  update: () =>
    `UPDATE med_practioners SET name = ?, specialization = ?, hospital_id = ? WHERE id = ?`,

  remove: () => `DELETE FROM med_practioners WHERE id = ?`
};