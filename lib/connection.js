const {
  default: makeWASocket,
  useSingleFileAuthState
} = require('@whiskeysockets/baileys')
const qrcode = require('qrcode')
const fs = require('fs')
const path = require('path')
const axios = require('axios') // Future use: API calls
const FormData = require('form-data') // Future use: upload
const mime = require('mime-types') // Future use: file MIME type

const { state, saveState } = useSingleFileAuthState('./sessions/indoprime-session.json')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function loadPlugins(sock, msg, from, text) {
  const pluginPath = path.join(__dirname, '..', 'plugins')
  const pluginFiles = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js'))

  for (const file of pluginFiles) {
    try {
      const plugin = require(path.join(pluginPath, file))
      if (typeof plugin.run === 'function') {
        plugin.run({ sock, msg, from, text })
      }
    } catch (err) {
      console.error(`[PLUGIN ERROR] ${file} →`, err.message)
    }
  }
}

async function connectBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on('creds.update', saveState)

  sock.ev.on('connection.update', async ({ connection, qr }) => {
    if (qr) {
      global.qrCode = qr
      await qrcode.toFile('./file/qr.jpg', qr, { width: 300 })
      console.log('[QR] Disimpan di file/qr.jpg')
    }

    if (connection === 'open') {
      console.log('✅ Bot sudah terkoneksi ke WhatsApp!')

      // Kirim notifikasi ke Bos Indoprime
      try {
        await sock.sendMessage('6283148450932@s.whatsapp.net', {
          text: 'Indoprime Aktif'
        })
      } catch (err) {
        console.error('❌ Gagal kirim notifikasi WA:', err.message)
      }
    }

    if (connection === 'close') {
      console.log('❌ Koneksi terputus, mencoba ulang...')
      connectBot()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    const msg = messages[0]
    const from = msg.key.remoteJid
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      ''

    if (!text) return

    await sock.sendPresenceUpdate('available', from)
    await delay(5000)

    loadPlugins(sock, msg, from, text.toLowerCase())
  })

  return sock
}

module.exports = connectBot
