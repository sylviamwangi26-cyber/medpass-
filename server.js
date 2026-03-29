// server.js

// FIX: Change 'import' to 'require' for all modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes = require('./Routes/adminRoutes');
const billingRoutes = require('./Routes/billingRoutes');
const billingController = require('./controllers/billingController');
const db = require('./config/db'); // The database connection

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Start AI Agent
const AIAgent = require('./services/aiAgent');
AIAgent.start();

const fs = require('fs');
const multer = require('multer');

// Configure Multer for Profile Pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Configure Multer for Medical Scans
const imagingStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/imaging/'),
    filename: (req, file, cb) => cb(null, 'SCAN-' + Date.now() + '-' + file.originalname)
});
const uploadImaging = multer({ storage: imagingStorage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') console.log('Payload:', JSON.stringify(req.body));
    next();
});

// API Routes
app.use('/auth', require('./Routes/authRoutes'));
app.use('/hospitals', require('./Routes/hospitalsRoutes'));
app.use('/medpractioners', require('./Routes/medpractionerRoutes'));
app.use('/admins', adminRoutes);
app.use('/billing', billingRoutes);
app.post('/billing/payout', billingController.payoutHospital);
app.use('/payments', require('./Routes/paymentRoutes'));
app.use('/claims', require('./Routes/claimsRoutes'));
app.use('/insurance-providers', require('./Routes/insuaranceproviderRoutes'));

// New Medical Routes
app.use('/triage', require('./Routes/triageRoutes'));
app.use('/labs', require('./Routes/labRoutes'));
app.use('/pharmacy', require('./Routes/pharmacyRoutes'));
app.use('/insurance', require('./Routes/insuranceRoutes'));
app.use('/stats', require('./Routes/statsRoutes'));
app.use('/imaging', require('./Routes/imagingRoutes'));
app.use('/awards', require('./Routes/awardsRoutes'));

// Patients & Visits
app.use('/patients', require('./Routes/patientsRoutes'));
app.use('/visits', require('./Routes/visitsRoutes'));
app.use('/referrals', require('./Routes/referralsRoutes'));
app.use('/staff', require('./routes/staffRoutes'));

// AI Agent Manual Trigger
app.get('/debug/trigger-ai', async (req, res) => {
    try {
        console.log("🚀 Manual AI Trigger Received...");
        await AIAgent.processReminders();
        res.json({ message: "AI Agent cycle executed. Check server console!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Seed Demo Data
app.get('/debug/seed-demo-data', async (req, res) => {
    try {
        console.log("🌱 Seeding Demo Data...");
        db.query(`INSERT IGNORE INTO hospitals (id, unique_id, name, location, email, password) 
                  VALUES (999, 'MP-HOS-DEMO', 'Demo Hospital', 'Presentation Hall', 'demo@hospital.com', 'demo')`);
        db.query(`INSERT IGNORE INTO users (id, unique_id, full_name, email, password, role, hospital_id) 
                  VALUES (999, 'MP-PAT-DEMO', 'John Doe Demo', 'john@demo.com', 'demo', 'patient', 1)`);
        db.query(`INSERT IGNORE INTO patients (id, unique_id, user_id, name, phone, last_engagement) 
                  VALUES (999, 'MP-PAT-DEMO', 999, 'John Doe Demo', '+254712345678', NULL)`);
        db.query(`INSERT INTO visits (patient_id, hospital_id, medications, notes) 
                  VALUES (999, 1, 'Paracetamol 500mg, Amoxicillin', 'Initial demo consultation')`);

        res.json({ message: "Demo data seeded!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dedicated Upload Route for Imaging
app.post('/imaging/upload-file', uploadImaging.single('scan'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ message: "File uploaded", fileurl: `/uploads/imaging/${req.file.filename}` });
});

// Serve Static Frontend
app.use(express.static('.'));
app.get('/', (req, res) => {
    res.sendFile(require('path').join(__dirname, 'index.html'));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 MEDPASS SYSTEM IS LIVE!`);
    console.log(`🌍 Access the Hospital Management System here: http://localhost:${PORT}`);
    console.log(`📝 Keep this window open for real-time logs and AI Health Agent activity.\n`);
});