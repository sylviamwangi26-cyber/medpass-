// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM insurance_provider`;

// SAFE: Controller passes ID separately: db.query(getById(), [id], ...)
export const getById = () => `SELECT * FROM insurance_provider WHERE id = ?`;

// SAFE: Controller passes values separately: db.query(create(), [name, contact], ...)
export const create = () =>
  `INSERT INTO insurance_provider (name, contact) VALUES (?, ?)`;

// SAFE: Controller passes values and ID separately: db.query(update(), [name, contact, id], ...)
export const update = () =>
  `UPDATE insurance_provider SET name = ?, contact = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// SAFE: Controller passes ID separately: db.query(remove(), [id], ...)
export const remove = () => `DELETE FROM insurance_provider WHERE id = ?`;