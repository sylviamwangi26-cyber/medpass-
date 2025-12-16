// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM labs`;

// SAFE: Controller passes ID separately: db.query(getById(), [id], ...)
export const getById = () => `SELECT * FROM labs WHERE id = ?`;

// SAFE: Controller passes values separately: db.query(create(), [name, location], ...)
export const create = () =>
  `INSERT INTO labs (name, location) VALUES (?, ?)`;

// SAFE: Controller passes values and ID separately: db.query(update(), [name, location, id], ...)
export const update = () =>
  `UPDATE labs SET name = ?, location = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// SAFE: Controller passes ID separately: db.query(remove(), [id], ...)
export const remove = () => `DELETE FROM labs WHERE id = ?`;