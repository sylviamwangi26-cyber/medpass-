// services/aiAgent.js
const db = require('../config/db');
const SMS = require('./smsService');

class AIAgent {
    constructor() { this.interval = null; }

    start() {
        console.log("🤖 AI Agent: Monitoring system for health reminders...");
        // Fast interval for demonstration
        this.interval = setInterval(() => this.processReminders(), 60000);
    }

    stop() { if (this.interval) clearInterval(this.interval); }

    async processReminders() {
        console.log("🤖 AI Agent: Running automation cycle...");

        // 1. Follow-up Reminders for Recent Visits
        const visitQuery = `
            SELECT v.medications, u.full_name, u.phone, p.id as patient_id
            FROM visits v
            JOIN patients p ON v.patient_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE v.visit_date >= NOW() - INTERVAL 1 DAY
            AND (p.last_engagement < NOW() - INTERVAL 4 HOUR OR p.last_engagement IS NULL)
            LIMIT 10
        `;

        db.query(visitQuery, (err, visits) => {
            if (err) return console.error("❌ AI Agent Visit Query Error:", err.message);
            if (visits && visits.length > 0) {
                visits.forEach(v => {
                    if (v.phone && v.medications) {
                        SMS.sendSMS(v.phone, `[MedPass AI] ${v.full_name}, reminder to follow your prescription: ${v.medications}. Prompt recovery!`);
                        this.updateEngagement(v.patient_id);
                    }
                });
            }
        });

        // 2. Proactive Health Tips
        const healthTipsQuery = `
            SELECT u.full_name, u.phone, p.id as patient_id
            FROM patients p
            JOIN users u ON p.user_id = u.id
            WHERE p.last_engagement < NOW() - INTERVAL 1 DAY OR p.last_engagement IS NULL
            LIMIT 5
        `;

        const tips = [
            "Drink at least 8 glasses of water today for better kidney health.",
            "A 15-minute walk after meals helps regulate blood sugar levels.",
            "Include green leafy vegetables in your diet to boost immunity.",
            "Prioritize 7-8 hours of sleep to help your body recover.",
            "Reduce salt intake to maintain healthy blood pressure.",
            "Remember to take deep breaths for a healthy heart."
        ];

        db.query(healthTipsQuery, (err, patients) => {
            if (err) return console.error("❌ AI Agent Health Tips Query Error:", err.message);
            if (patients && patients.length > 0) {
                patients.forEach(p => {
                    if (p.phone) {
                        const tip = tips[Math.floor(Math.random() * tips.length)];
                        SMS.sendSMS(p.phone, `[Health Tip] ${p.full_name}: ${tip} - Stay Healthy with MedPass!`);
                        this.updateEngagement(p.patient_id);
                    }
                });
            }
        });
    }

    updateEngagement(patientId) {
        db.query(`UPDATE patients SET last_engagement = NOW() WHERE id = ?`, [patientId]);
    }
}

module.exports = new AIAgent();
