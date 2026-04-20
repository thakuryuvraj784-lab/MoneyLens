const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)


// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existing) {
      return res.status(400).json({ message: 'Email already registered!' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash }])
      .select()

    if (error) throw error

    const token = jwt.sign(
      { userId: data[0].id, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ message: 'Account created!', token, user: { name, email } })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong!', error: err.message })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      return res.status(400).json({ message: 'Email not found!' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(400).json({ message: 'Wrong password!' })
    }

    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ message: 'Login successful!', token, user: { name: user.name, email } })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong!', error: err.message })
  }
})

module.exports = router