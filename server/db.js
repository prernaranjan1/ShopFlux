const mysql = require("mysql2");

// ✅ USE ENVIRONMENT VARIABLES FOR SECURITY
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Hello@world2027",
  database: process.env.DB_NAME || "ecommerce"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
    console.error("Host:", process.env.DB_HOST || "localhost");
    console.error("User:", process.env.DB_USER || "root");
    console.error("Database:", process.env.DB_NAME || "ecommerce");
    
    // Retry connection after 5 seconds
    setTimeout(() => db.connect(), 5000);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// Handle connection errors
db.on('error', (err) => {
  console.error("❌ Database error:", err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    db.connect();
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    db.connect();
  }
  if (err.code === 'ECONNREFUSED') {
    db.connect();
  }
});

module.exports = db;