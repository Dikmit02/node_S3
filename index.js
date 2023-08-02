const app = require('./app')
const { PORT } = require('./config')

const port = PORT

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
