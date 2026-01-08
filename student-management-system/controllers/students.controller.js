const students = require('../src/data/students');
// const students = require('../src/data/students');

// ดึงข้อมูลนักเรียนทั้งหมด
function getStudents(req,res) {
  res.json(students);
}

function searchStudentByName(req,res) {

  const {name} =req.query;

    // ใช้ toLowerCase เพื่อให้ค้นหาแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
    const results = students.filter(student => 
        student.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json(results);
}

// ดึงข้อมูลตาม id
function getStudentById(req,res) {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).json({
      message:'ไม่เจอนักเรียนจ้า'
    })
  }

  res.json(student);
}

// ส่งข้อมูลไปโหลดที่หน้า EJS
function renderStudentsPage(req,res) {
  res.render('students',{students});
}

module.exports = {
  getStudents,
  getStudentById,
  renderStudentsPage,
  searchStudentByName
}