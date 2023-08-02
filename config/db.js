const mongoose = require('mongoose')
const { DB_URL } = require('./index')

const connection = mongoose
  .createConnection(DB_URL)
  .on('open', () => {
    console.log('MongoDB Connected')
  })
  .on('error', () => {
    console.log('MongoDB Connection error')
  })

module.exports = connection
