// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM patients`;

// SAFE: Controller passes ID separately: db.query(getById(), [id], ...)
export const getById = () => `SELECT * FROM patients WHERE id = ?`;

// SAFE: Controller passes values separately: db.query(create(), [name, dob, ward, bed_number], ...)
export const create = () =>
  `INSERT INTO patients (name, dob, ward, bed_number) VALUES (?, ?, ?, ?)`;

// SAFE: Controller passes values and ID separately: db.query(update(), [name, dob, ward, bed_number, id], ...)
export const update = () =>
  `UPDATE patients SET name = ?, dob = ?, ward = ?, bed_number = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// SAFE: Controller passes ID separately: db.query(remove(), [id], ...)
export const remove = () => `DELETE FROM patients WHERE id = ?`;