const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MoneyLens API is running! 🚀' })
})

// Auth routes
app.use('/api/auth', require('./routes/auth'))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})