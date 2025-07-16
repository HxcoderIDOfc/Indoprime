const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send('✅ Bot PrimeAi is online & running!')
})

module.exports = router