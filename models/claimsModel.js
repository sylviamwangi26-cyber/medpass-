// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM claims`;

// Controller passes the ID separately: db.query(Claims.getById(), [id], ...)
export const getById = () => `SELECT * FROM claims WHERE id = ?`;

// Controller passes values separately: db.query(Claims.create(), [patient_id, claim_type, status], ...)
export const create = () =>
  `INSERT INTO claims (patient_id, claim_type, status) VALUES (?, ?, ?)`;

// Controller passes values and ID separately: db.query(Claims.update(), [status, id], ...)
export const update = () =>
  `UPDATE claims SET status = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// Controller passes the ID separately: db.query(Claims.remove(), [id], ...)
export const remove = () => `DELETE FROM claims WHERE id = ?`;