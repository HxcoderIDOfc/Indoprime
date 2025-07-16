const express = require('express')
const router = express.Router()

let socket

// Taruh fungsi buat inject socket WA
function injectSocket(sock) {
  socket = sock
}

// Endpoint utama
router.post('/', async (req, res) => {
  const { number, message } = req.body

  if (!socket) {
    return res.status(500).json({ status: false, message: 'Socket belum siap!' })
  }

  if (!number || !message) {
    return res.status(400).json({ status: false, message: 'number dan message wajib' })
  }

  try {
    const jid = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    await socket.sendMessage(jid, { text: message })
    res.json({ status: true, message: 'Pesan terkirim ke WA' })
  } catch (err) {
    console.error('❌ Gagal kirim WA:', err.message)
    res.status(500).json({ status: false, message: 'Gagal kirim pesan ke WA' })
  }
})

module.exports = { router, injectSocket }