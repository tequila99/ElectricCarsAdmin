const path = require('path')
const app = require('./app/app')
const PORT = process.env.PORT || 3600
const publicPath = path.join(__dirname, process.env.PUBLIC_PATH || 'public')

app({
  logger: true, publicPath
})
  .listen(PORT, '0.0.0.0', err => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
