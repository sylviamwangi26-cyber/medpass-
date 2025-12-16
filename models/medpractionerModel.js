// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM med_practioners`;

// SAFE: Controller passes ID separately: db.query(getById(), [id], ...)
export const getById = () => `SELECT * FROM med_practioners WHERE id = ?`;

// SAFE: Controller passes values separately: db.query(create(), [name, specialization], ...)
export const create = () =>
  `INSERT INTO med_practioners (name, specialization) VALUES (?, ?)`;

// SAFE: Controller passes values and ID separately: db.query(update(), [name, specialization, id], ...)
export const update = () =>
  `UPDATE med_practioners SET name = ?, specialization = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// SAFE: Controller passes ID separately: db.query(remove(), [id], ...)
export const remove = () => `DELETE FROM med_practioners WHERE id = ?`;