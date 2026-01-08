const express = require('express');
const router = express.Router();

const students = require('../src/data/students.js');


// GET all students or filter by name /students
router.get('/', (req, res) => {
  const { name } = req.query;

  let result = students;
  if (name) {
    result = students.filter(s =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  res.json({
    ok: true,
    count: result.length,
    query: req.query,
    data: result,
  });
});

router.post('/', (req, res) => {
  const {studentNo,name,major } = req.body;

  if (!studentNo || !name) {
  return res.status(400).json({ok:false,message:"Already"})  
  }

  const newStudent = {
    id : students.length+1,
    studentNo,
    name,
    major:major||"Software Engineering"
  }
  
  students.push(newStudent);
  res.status(201).json({ok:true,message:"Success"})  
});


// GET /students/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ ok: false, message: "Student not found" });
  }

  res.json({ ok: true, data: student });
});




module.exports = router;