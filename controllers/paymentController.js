const db = require('../config/db');
const Payment = require('../models/paymentModel');

module.exports = {
  getAllPayments: (req, res) => {
    db.query(Payment.getAll(), (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getPaymentById: (req, res) => {
    const { id } = req.params;
    db.query(Payment.getById(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Payment not found' });
      res.json(result[0]);
    });
  },

  createPayment: (req, res) => {
    const { patient_id, amount, method } = req.body;
    db.query(Payment.create(), [patient_id, amount, method], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, patient_id, amount, method });
    });
  },

  updatePayment: (req, res) => {
    const { id } = req.params;
    const { amount, method } = req.body;
    db.query(Payment.update(), [amount, method, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Payment not found' });
      res.json({ message: 'Payment updated successfully' });
    });
  },

  deletePayment: (req, res) => {
    const { id } = req.params;
    db.query(Payment.remove(), [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Payment not found' });
      res.json({ message: 'Payment deleted successfully' });
    });
  }
};
