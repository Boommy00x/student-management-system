const express = require('express');
const app = express();

const studentsRouter = require('./routes/students.routes');
const wowRouter = require('./routes/wow.routes');

// middleware พื้นฐาน
app.use(express.json());

// ตัวอย่าง route หลัก
app.get('/', (req, res) => {
    res.send('U is gay');
});

// middleware mount students routes ที่ path /students
app.use('/students', studentsRouter);
app.use('/wows', wowRouter);

module.exports = app;