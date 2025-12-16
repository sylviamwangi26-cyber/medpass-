// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM hospitals`;

// SAFE: The controller passes the ID separately: db.query(Hospitals.getById(), [id], ...)
export const getById = () => `SELECT * FROM hospitals WHERE id = ?`;

// SAFE: The controller passes values separately: db.query(Hospitals.create(), [name, location], ...)
export const create = () =>
  `INSERT INTO hospitals (name, location) VALUES (?, ?)`;

// SAFE: The controller passes values and ID separately: db.query(Hospitals.update(), [name, location, id], ...)
export const update = () =>
  `UPDATE hospitals SET name = ?, location = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// SAFE: The controller passes the ID separately: db.query(Hospitals.remove(), [id], ...)
export const remove = () => `DELETE FROM hospitals WHERE id = ?`;