// models/patientsModel.js

module.exports = {
  getAll: () => `SELECT * FROM patients`,

  getById: () => `SELECT * FROM patients WHERE id = ?`,
  getByUserId: () => `SELECT * FROM patients WHERE user_id = ?`,
  getByUniqueId: () => `SELECT * FROM patients WHERE unique_id = ?`,

  create: () =>
    `INSERT INTO patients (unique_id, user_id, family_id, name, dob, gender, blood_group, allergies, location, phone, emergency_contact, profile_picture, insurance_type, insurance_id, medpass_plan, national_id, primary_hospital_id, preferred_doctor_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

  update: () =>
    `UPDATE patients SET name = ?, dob = ?, gender = ?, blood_group = ?, allergies = ?, location = ?, emergency_contact = ?, profile_picture = ?, insurance_type = ?, insurance_id = ?, medpass_plan = ?, national_id = ?, primary_hospital_id = ?, preferred_doctor_name = ? WHERE id = ?`,

  remove: () => `DELETE FROM patients WHERE id = ?`
};