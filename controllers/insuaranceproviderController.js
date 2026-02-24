const db = require('../config/db');

module.exports = {
  getAllProviders: (req, res) => {
    db.query('SELECT * FROM insurance_provider', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getProviderById: (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM insurance_provider WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'Insurance provider not found' });
      res.json(results[0]);
    });
  },

  createProvider: (req, res) => {
    const { name, policy_number, contact } = req.body;
    db.query('INSERT INTO insurance_provider (name, policy_number, contact) VALUES (?, ?, ?)', [name, policy_number, contact], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Provider added successfully', id: result.insertId });
    });
  },

  updateProvider: (req, res) => {
    const { id } = req.params;
    const { name, policy_number, contact } = req.body;
    db.query('UPDATE insurance_provider SET name=?, policy_number=?, contact=? WHERE id=?', [name, policy_number, contact, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Insurance provider not found for update' });
      res.json({ message: 'Provider updated successfully' });
    });
  },

  deleteProvider: (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM insurance_provider WHERE id=?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Insurance provider not found for deletion' });
      res.json({ message: 'Provider deleted successfully' });
    });
  }
};
