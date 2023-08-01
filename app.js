const express = require('express')
const bodyparser = require('body-parser')
const UserRouter = require('./routes/user.router')
const SimilarToS3 = require('./routes/similiartos3.router')

const app = express()
app.use(bodyparser.json())
app.use('/', UserRouter)
app.use('/', SimilarToS3)
module.exports = app
