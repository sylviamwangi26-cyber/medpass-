// models/billingModels.js

// Using 'module.exports' for CommonJS
module.exports = {
  // Parameterized queries use '?' placeholders for security
  getAll: () => `SELECT * FROM billing`,

  // Secure: Uses '?' for the ID
  getById: () => `SELECT * FROM billing WHERE id = ?`,

  // Secure: Uses '?' for all user-provided values
  create: () =>
      `INSERT INTO billing (patient_id, amount, description) VALUES (?, ?, ?)`,

  // Secure: Uses '?' for amount, description, and the ID
  update: () =>
      `UPDATE billing SET amount = ?, description = ? WHERE id = ?`,

  // Renamed 'delete' to 'remove' to avoid conflict, uses '?' for ID
  remove: () => `DELETE FROM billing WHERE id = ?`,
};