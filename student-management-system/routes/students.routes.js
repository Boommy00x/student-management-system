const express = require("express");
const router = express.Router(); // สร้าง instance ของ Router object ขึ้นมาใหม่ ผ่าน method .Router() ของ express

const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    renderStudentsPage,
} = require("../controllers/students.controller");

router.get("/view", renderStudentsPage);

router.get("/", getStudents);
// router.get('/search',searchStudentByName);

router.post("/", createStudent);

router.get("/:id", getStudentById);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

module.exports = router;
