module.exports.run = async ({ sock, msg, from, text }) => {
  if (text === 'menu') {
    const menu = `
📜 *PrimeAiBot Menu*:
• ping – Cek status bot
• menu – Lihat menu
• status – (fitur tambahan nanti)
• saldo – (fitur dengan API MySQL)

Bot ini dilindungi ✨ oleh PrimeAi x Indoprime ©2025
    `.trim()

    await sock.sendMessage(from, { text: menu }, { quoted: msg })
  }
}