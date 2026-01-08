const express = require('express');
const path = require('path');

const logger = require('./middleware/logger');
const studentRoutes = require('./routes/students.routes')

const app = express();

// standard middleware
app.use(logger)
app.use(express.json());


//ตั้งค่า view EJS
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// mount routes คือ routes ใหม่หรือ endpoint
app.use('/students', studentRoutes);

app.get('/',(req,res)=>{
  res.send("SmS Project กำลังวิ่ง")
})

module.exports = app
