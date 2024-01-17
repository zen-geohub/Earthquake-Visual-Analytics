const pool = require('../../db')
const queries = require('./queries')

const getData = (req, res) => {
  const year = req.params.year
  pool.query(queries.getData, [year], (error, results) => {
    if (error) throw error
    res.status(200).json(results.rows)
  })
}

const getDataCount = (req, res) => {
  pool.query(queries.getDataCount, (error, results) => {
    if (error) throw error
    res.status(200).json(results.rows)
  })
}

const getDatabyDateRange = (req, res) => {
  const startDate = req.params.startDate
  const endDate = req.params.endDate
  pool.query(queries.getDatabyDateRange, [startDate, endDate], (error, results) => {
    if (error) throw error
    res.status(200).json(results.rows)
  })
}


module.exports = {
  getData,
  getDataCount,
  getDatabyDateRange,
}