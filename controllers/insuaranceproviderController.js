import db from '../config/db.js';

export const getAllProviders = (req, res) => {
  // Corrected table name to 'insurance_provider'
  db.query('SELECT * FROM insurance_provider', (err, results) => {
    // Standardized error response
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getProviderById = (req, res) => {
  const { id } = req.params;
  // Corrected table name to 'insurance_provider'
  db.query('SELECT * FROM insurance_provider WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Check if provider was found
    if (results.length === 0) {
      return res.status(404).json({ message: 'Insurance provider not found' });
    }
    res.json(results[0]);
  });
};

export const createProvider = (req, res) => {
  const { name, policy_number, contact } = req.body;
  db.query(
    'INSERT INTO insurance_provider (name, policy_number, contact) VALUES (?, ?, ?)',
    [name, policy_number, contact],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Provider added successfully', id: result.insertId });
    }
  );
};

export const updateProvider = (req, res) => {
  const { id } = req.params;
  const { name, policy_number, contact } = req.body;
  db.query(
    // Corrected table name to 'insurance_provider'
    'UPDATE insurance_provider SET name=?, policy_number=?, contact=? WHERE id=?',
    [name, policy_number, contact, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Check if any row was actually updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Insurance provider not found for update' });
      }
      res.json({ message: 'Provider updated successfully' });
    }
  );
};

export const deleteProvider = (req, res) => {
  const { id } = req.params;
  // Corrected table name to 'insurance_provider'
  db.query('DELETE FROM insurance_provider WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Check if any row was actually deleted
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Insurance provider not found for deletion' });
    }
    res.json({ message: 'Provider deleted successfully' });
  });
};