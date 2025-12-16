// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM payment`;

// SAFE: Controller passes ID separately: db.query(getById(), [id], ...)
export const getById = () => `SELECT * FROM payment WHERE id = ?`;

// SAFE: Controller passes values separately: db.query(create(), [patient_id, amount, method], ...)
export const create = () =>
  `INSERT INTO payment (patient_id, amount, method) VALUES (?, ?, ?)`;

// SAFE: Controller passes values and ID separately: db.query(update(), [amount, method, id], ...)
export const update = () =>
  `UPDATE payment SET amount = ?, method = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// SAFE: Controller passes ID separately: db.query(remove(), [id], ...)
export const remove = () => `DELETE FROM payment WHERE id = ?`;