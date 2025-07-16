module.exports.run = async ({ sock, msg, from, text }) => {
  if (text === 'ping') {
    await sock.sendMessage(from, { text: 'Pong dari PrimeAiBot 🚀' }, { quoted: msg })
  }
}