// 1. Change 'require' to 'import' and add the mandatory .js extension
import db from '../config/db.js';
import Payment from '../models/paymentModels.js';

// 2. Change 'exports.functionName' to 'export const functionName'

export const getAllPayments = (req, res) => {
  // Model returns 'SELECT * FROM payment'
  db.query(Payment.getAll(), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getPaymentById = (req, res) => {
  const { id } = req.params;
  // Model returns 'SELECT * FROM payment WHERE id = ?'
  db.query(Payment.getById(), [id], (err, result) => { // Pass [id] separately for safety
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(result[0]);
  });
};

export const createPayment = (req, res) => {
  const { patient_id, amount, method } = req.body;
  // Model returns 'INSERT INTO payment (...) VALUES (?, ?, ?)'
  db.query(Payment.create(), [patient_id, amount, method], (err, result) => { // Pass values separately for safety
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, patient_id, amount, method });
  });
};

export const updatePayment = (req, res) => {
  const { id } = req.params;
  const { amount, method } = req.body;
  // Model returns 'UPDATE payment SET ... WHERE id = ?'
  db.query(Payment.update(), [amount, method, id], (err, result) => { // Pass values and ID separately for safety
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment updated successfully' });
  });
};

export const deletePayment = (req, res) => {
  const { id } = req.params;
  // Assuming model function is named 'remove' (safer than 'delete')
  // Model returns 'DELETE FROM payment WHERE id = ?'
  db.query(Payment.remove(), [id], (err, result) => { // Pass [id] separately for safety
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted successfully' });
  });
};