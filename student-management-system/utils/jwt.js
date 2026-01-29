const jwt = require('jsonwebtoken')

// ใช้ออก token โดยรับข้อมูลที่จำเป็น เช่น user_id && role
function signToken(payload) {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h'

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  return jwt.sign(payload, secret, { expiresIn })
}

// ใช้ตรวจสอบ token จะถูกเรียกจาก middleware ก่อนเข้า controller
function verifyToken(token) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  return jwt.verify(token, secret)
}

module.exports = {
  signToken,
  verifyToken,
}
