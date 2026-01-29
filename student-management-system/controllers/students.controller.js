const { PrismaClient } = require('@prisma/client')

class StudentController {
  constructor() {
    this.prisma = new PrismaClient()
  }

  // Helper Function (Task 2) - เปลี่ยนเป็น private method
  parseStudentId(req) {
    const id = parseInt(req.params.id)
    if (!Number.isInteger(id) || id <= 0) return null
    return id
  }

  // Task 3: GET /students
  // ใช้ Arrow Function เพื่อให้ 'this' อ้างอิงถึง Class เสมอ
  getStudents = async (req, res) => {
    try {
      // เช็คชื่อ Table ใน Prisma Schema ดีๆ นะครับ (student หรือ students)
      const students = await this.prisma.students.findMany({
        orderBy: { student_id: 'asc' },
      })
      return res.json(students)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Task 4: GET /students/:id
  getStudentById = async (req, res) => {
    try {
      const id = this.parseStudentId(req) // เรียกใช้ Helper ใน Class
      if (!id) return res.status(400).json({ error: 'Invalid student id' })

      const student = await this.prisma.students.findUnique({
        where: { student_id: id },
      })

      if (!student) return res.status(404).json({ error: 'Student not found' })
      return res.json(student)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Task 5: POST /students
  createStudent = async (req, res) => {
    try {
      const {
        student_no,
        first_name,
        last_name_th,
        program_id,
        email,
        phone,
        status,
        last_name_en,
        address,
      } = req.body

      // แก้ Logic การเช็ค undefined ให้ถูกต้อง
      if (
        !student_no ||
        !first_name ||
        !last_name_th ||
        program_id === undefined
      ) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const created = await this.prisma.students.create({
        data: {
          student_no,
          first_name,
          last_name_th,
          last_name_en: last_name_en ?? '',
          program_id: Number(program_id),
          email: email ?? null,
          phone: phone ?? null,
          status: status ?? null,
          address: address ?? null, // เพิ่ม address ถ้ามีใน Schema
        },
      })

      // created
      return res.status(201).json(created)
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate student number' })
      }
      return res.status(500).json({ error: error.message })
    }
  }

  // Task 6: PUT /students/:id
  updateStudent = async (req, res) => {
    try {
      const studentId = this.parseStudentId(req)
      if (!studentId)
        return res.status(400).json({ error: 'Invalid student id' })

      const {
        student_no,
        first_name,
        last_name_th,
        program_id,
        email,
        phone,
        status,
        last_name_en,
      } = req.body

      // เตรียมข้อมูล Update
      const updateData = {}
      if (student_no) updateData.student_no = student_no
      if (first_name) updateData.first_name = first_name
      if (last_name_th) updateData.last_name_th = last_name_th
      if (last_name_en) updateData.last_name_en = last_name_en
      if (program_id !== undefined) updateData.program_id = Number(program_id)
      if (email) updateData.email = email
      if (phone) updateData.phone = phone
      if (status) updateData.status = status

      const updatedStudent = await this.prisma.students.update({
        where: { student_id: studentId },
        data: updateData,
      })

      return res.json(updatedStudent)
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate student number' })
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Student not found' })
      }
      return res.status(500).json({ error: error.message })
    }
  }

  // Task 7: DELETE /students/:id
  deleteStudent = async (req, res) => {
    try {
      const studentId = this.parseStudentId(req)
      if (!studentId)
        return res.status(400).json({ error: 'Invalid student id' })

      await this.prisma.students.delete({
        where: { student_id: studentId },
      })

      return res.json({ MessageChannel: 'Student deleted successfully' })
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Student not found' })
      }
      return res.status(500).json({ error: error.message })
    }
  }

  // Optional: Render Page
  renderStudentPage = async (req, res) => {
    try {
      const students = await this.prisma.students.findMany({
        orderBy: { student_id: 'asc' },
      })
      return res.render('students', { students })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

// สร้าง Instance และ Export ออกไปใช้งาน (ในฝั่งคนเรียกใช้)
const studentController = new StudentController()

module.exports = {
  getStudents: studentController.getStudents,
  getStudentById: studentController.getStudentById,
  createStudent: studentController.createStudent,
  updateStudent: studentController.updateStudent,
  deleteStudent: studentController.deleteStudent,
  renderStudentsPage: studentController.renderStudentPage,
}
