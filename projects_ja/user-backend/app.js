const express = require('express');
const app = express();

const userRoutes = require('./routes/users.routes');

// ============ CORS Middleware ============
app.use((req, res, next) => {
  // อนุญาตเฉพาะ frontend ของเรา
  res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // สำหรับ preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ============ Logging Middleware ============
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);

app.use((req, res, next) => {
  const logData = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "Unknown",
    query: req.query,
  };

  logStream.write(JSON.stringify(logData) + "\n");
  console.log(`${req.method} ${req.url} - ${req.ip}`);

  next();
});

// ============ Body Parser ============
app.use(express.json());

// ============ Routes ============
app.use('/users', userRoutes);

// ============ Error Handler ============
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============ Cleanup ============
process.on("SIGINT", () => {
  logStream.end();
  console.log("Log stream closed");
  process.exit(0);
});

module.exports = app;