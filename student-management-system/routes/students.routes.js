const express = require('express');
const router = express.Router(); // สร้าง instance ของ Router object ขึ้นมาใหม่ ผ่าน method .Router() ของ express

const {
  getStudents,
  getStudentById,
  renderStudentsPage,
  searchStudentByName
} = require('../controllers/students.controller');

router.get('/view',  renderStudentsPage);

router.get('/', getStudents);
router.get('/search',searchStudentByName);
router.get('/:id', getStudentById);

module.exports = router;