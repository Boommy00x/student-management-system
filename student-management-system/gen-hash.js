const bcrypt = require('bcryptjs')

async function genHash(password) {
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  console.log('Password Hash:', hash)
}

// Generate a random password
const randomPassword = Math.random().toString(36).slice(2, 12)
console.log('Generated Password:', randomPassword)
genHash(randomPassword)
