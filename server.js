// server.js

// FIX: Change 'import' to 'require' for all modules
const express = require("express");
const dotenv = require("dotenv");
const adminRoutes = require('./routes/adminRoutes');
const billingRoutes = require('./routes/billingRoutes');
const db = require('./config/db'); // The database connection we fixed earlier

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// API ROUTES
// FIX: The imported routes are ready to use
app.use('/admins', adminRoutes);

app.use('/billing', billingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});