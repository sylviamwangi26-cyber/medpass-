// controllers/statsController.js
const db = require('../config/db');

module.exports = {
    // Hospital Admin Stats: Aggregate counts for a specific hospital
    getHospitalStats: (req, res) => {
        const { hospitalId } = req.params;

        const queries = {
            pendingLabs: `SELECT COUNT(*) as count FROM lab_records l 
                          JOIN visits v ON l.visit_id = v.id 
                          WHERE v.hospital_id = ? AND l.status = 'Pending'`,
            pendingPharmacy: `SELECT COUNT(*) as count FROM pharmacy_records p 
                              JOIN visits v ON p.visit_id = v.id 
                              WHERE v.hospital_id = ? AND p.status = 'Pending'`,
            totalRevenue: `SELECT SUM(amount) as total FROM billing b 
                           JOIN visits v ON b.visit_id = v.id 
                           WHERE v.hospital_id = ? AND b.status = 'Paid'`,
            patientCount: `SELECT COUNT(DISTINCT patient_id) as count FROM visits WHERE hospital_id = ?`,
            staffTelemetry: `SELECT num_doctors, num_nurses FROM hospitals WHERE id = ?`,
            monthlyRevenue: `SELECT MONTHNAME(created_at) as month, SUM(amount) as total 
                             FROM billing b 
                             JOIN visits v ON b.visit_id = v.id
                             WHERE v.hospital_id = ? AND b.status = 'Paid'
                             GROUP BY MONTH(created_at), MONTHNAME(created_at)
                             ORDER BY MONTH(created_at) LIMIT 6`,
            revenueByType: `SELECT billing_type, SUM(amount) as total 
                            FROM billing b 
                            JOIN visits v ON b.visit_id = v.id
                            WHERE v.hospital_id = ? AND b.status = 'Paid'
                            GROUP BY billing_type`
        };

        const stats = {};
        const keys = Object.keys(queries);
        let completed = 0;

        keys.forEach(key => {
            db.query(queries[key], [hospitalId], (err, results) => {
                completed++;
                if (!err) {
                    if (key === 'monthlyRevenue' || key === 'revenueByType') {
                        stats[key] = results;
                    } else if (key === 'staffTelemetry') {
                        stats[key] = results[0] || { num_doctors: 0, num_nurses: 0 };
                    } else {
                        stats[key] = results[0].count || results[0].total || 0;
                    }
                }
                if (completed === keys.length) {
                    res.json(stats);
                }
            });
        });
    },

    // Superadmin Stats: Global MedPass metrics
    getAdminStats: (req, res) => {
        const stats = {};

        db.query(`SELECT COUNT(*) as count FROM hospitals`, (err, hResults) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.totalHospitals = hResults[0].count;

            db.query(`SELECT COUNT(*) as count FROM users WHERE role = 'patient'`, (err, pResults) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.totalPatients = pResults[0].count;

                db.query(`SELECT SUM(amount) as total FROM billing WHERE status = 'paid'`, (err, rResults) => {
                    if (err) return res.status(500).json({ error: err.message });
                    stats.totalRevenue = rResults[0]?.total || 0;

                    db.query(`SELECT COUNT(*) as count FROM billing WHERE billing_type = 'Medpass' AND status = 'Billed'`, (err, cResults) => {
                        if (err) return res.status(500).json({ error: err.message });
                        stats.activeClaims = cResults[0].count;

                        // New: Role Distribution
                        db.query(`SELECT role, COUNT(*) as count FROM users GROUP BY role`, (err, roleResults) => {
                            if (err) return res.status(500).json({ error: err.message });
                            stats.roleDistribution = roleResults;

                            // New: Hospital Usage (Patients Treated)
                            db.query(`SELECT h.name, COUNT(v.id) as count FROM hospitals h 
                                      LEFT JOIN visits v ON h.id = v.hospital_id 
                                      GROUP BY h.id LIMIT 5`, (err, hospResults) => {
                                if (err) return res.status(500).json({ error: err.message });
                                stats.hospitalUsage = hospResults;

                                // Revenue Trend
                                db.query(`SELECT DATE_FORMAT(created_at, '%b') as month, SUM(amount) as total FROM billing GROUP BY month`, (err, revResults) => {
                                    if (err) return res.status(500).json({ error: err.message });
                                    stats.monthlyRevenue = revResults;
                                    res.json(stats);
                                });
                            });
                        });
                    });
                });
            });
        });
    }
};
