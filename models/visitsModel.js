// 1. Change 'exports.functionName' to 'export const functionName'
// 2. Use '?' placeholders instead of string interpolation for security

export const getAll = () => `SELECT * FROM visits`;

// SAFE: Controller passes ID separately: db.query(getById(), [id], ...)
export const getById = () => `SELECT * FROM visits WHERE id = ?`;

// SAFE: Controller passes values separately: db.query(create(), [patient_id, practitioner_id, visit_date, notes], ...)
export const create = () =>
  `INSERT INTO visits (patient_id, practitioner_id, visit_date, notes) VALUES (?, ?, ?, ?)`;

// SAFE: Controller passes values and ID separately: db.query(update(), [visit_date, notes, id], ...)
export const update = () =>
  `UPDATE visits SET visit_date = ?, notes = ? WHERE id = ?`;

// Renamed 'delete' to 'remove' to avoid conflict with the reserved JS keyword
// SAFE: Controller passes ID separately: db.query(remove(), [id], ...)
export const remove = () => `DELETE FROM visits WHERE id = ?`;