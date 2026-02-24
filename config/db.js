// db.js

// 1. Change 'import' to 'require' for dependencies
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('DB Pool Initialized:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

// No need for db.connect() with a pool, it connects on demand.
// But we can test it:
db.getConnection((err, conn) => {
  if (err) {
    console.error('❌ MySQL Pool Connection Failed!', err.message);
  } else {
    console.log('✅ MySQL Pool Ready.');
    conn.release();
  }
});

// 2. Change 'export default' to 'module.exports' for export
module.exports = db;