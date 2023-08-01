const mongoose = require('mongoose')
// mongoose.set('debug', true);

const connection = mongoose
  .createConnection(
    `mongodb+srv://dikshamittal21297:dikshamittal21297@cluster0.y2hv4xj.mongodb.net/?retryWrites=true&w=majority`,
  )
  .on('open', () => {
    console.log('MongoDB Connected')
  })
  .on('error', () => {
    console.log('MongoDB Connection error')
  })

module.exports = connection
