// models/adminModel.js

// FIX: Use 'module.exports' for CommonJS instead of 'export const'
module.exports = {
  // Secure: No parameters needed for SELECT *
  getAll: () => `SELECT * FROM admin`,

  // Secure: Uses '?' for the ID
  getById: () => `SELECT * FROM admin WHERE id = ?`,

  // Secure: Uses '?' for all user-provided values
  // Matches the order in adminController.createAdmin: [full_name, email, password]
  create: () =>
      `INSERT INTO admin (full_name, email, password) VALUES (?, ?, ?)`,

  // Secure: Uses '?' for all user-provided values
  // Matches the order in adminController.updateAdmin: [full_name, email, password, id]
  update: () =>
      `UPDATE admin SET full_name = ?, email = ?, password = ? WHERE id = ?`,

  // Using 'remove' to be consistent with billingModels
  // Secure: Uses '?' for ID
  remove: () => `DELETE FROM admin WHERE id = ?`,
};