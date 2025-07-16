const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '..', 'views', 'qr.html')
  res.sendFile(htmlPath)
})

router.get('/img', (req, res) => {
  const qrPath = path.join(__dirname, '..', 'file', 'qr.jpg')

  if (fs.existsSync(qrPath)) {
    res.sendFile(qrPath)
  } else {
    res.status(404).send('QR belum tersedia.')
  }
})

module.exports = router