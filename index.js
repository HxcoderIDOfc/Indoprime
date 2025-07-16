const express = require('express')
const app = express()
const config = require('./config.json')
const connectBot = require('./lib/connection')

const uptimeRoute = require('./routes/uptime')
const qrRoute = require('./routes/qr')
const { router: indoprimeRoute, injectSocket } = require('./routes/indoprime')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/file', express.static('file'))
app.use('/views', express.static('views'))
app.use('/', uptimeRoute)
app.use('/qr', qrRoute)
app.use('/indoprime.php', indoprimeRoute)

app.listen(config.port, () => {
  console.log(`Server aktif di port ${config.port}`)
})

connectBot().then(sock => {
  injectSocket(sock)
})