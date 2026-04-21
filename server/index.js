const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

// Manually load .env file
const envPath = path.join(__dirname, '.env')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) {
      process.env[key.trim()] = vals.join('=').trim()
    }
  })
}

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'MoneyLens API is running! 🚀' })
})

app.use('/api/auth', require('./routes/auth'))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})