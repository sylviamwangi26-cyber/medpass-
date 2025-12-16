// db.js

// 1. Change 'import' to 'require' for dependencies
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,       
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME     
});

console.log('Loaded .env:', process.env.DB_USER, process.env.DB_PASSWORD ? 'Password found' : 'No password');

db.connect((err) => {
    if (err) {
      console.error('❌ MySQL Connection Failed:', err.message);
    } else {
      console.log('✅ Connected to MySQL Database:', process.env.DB_NAME);
    }
});

// 2. Change 'export default' to 'module.exports' for export
module.exports = db;