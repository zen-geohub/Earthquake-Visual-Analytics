const { Router } = require('express')
const router = Router()
const controller = require('./controller')

router.get(('/getData/:year'), controller.getData)
router.get(('/getDataCount'), controller.getDataCount)
router.get(('/getDatabyDateRange/:startDate/:endDate'), controller.getDatabyDateRange)

module.exports = router