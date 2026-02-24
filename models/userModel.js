// models/userModel.js

module.exports = {
    // Get all users
    getAll: () => `SELECT * FROM users`,

    // Get user by ID
    getById: () => `SELECT * FROM users WHERE id = ?`,

    // Get user by email (for login)
    getByEmail: () => `SELECT * FROM users WHERE email = ?`,

    // Get user by Unique ID
    getByUniqueId: () => `SELECT * FROM users WHERE unique_id = ?`,

    // Create a new user
    // params: [unique_id, full_name, email, phone, password, role, hospital_id, language_preference]
    create: () =>
        `INSERT INTO users (unique_id, full_name, email, phone, password, role, hospital_id, language_preference) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

    // Update user
    update: () =>
        `UPDATE users SET full_name = ?, email = ?, role = ?, hospital_id = ? WHERE id = ?`,

    // Delete user
    remove: () => `DELETE FROM users WHERE id = ?`
};
