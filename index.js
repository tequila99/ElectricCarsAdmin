const path = require('path')
const fastify = require('./app/app')
const PORT = process.env.PORT || 3600
const publicPath = path.join(__dirname, process.env.PUBLIC_PATH || 'dist/spa')
const secretJwt = process.env.SECRET || 'fastify:super:secret:3333'
const pgConnect = process.env.PG_CONNECT || 'postgres://electrocar:electrocar@localhost:5432/electrocar'
const salt = process.env.SALT || 10
const tokenExpires = process.TOKEN_EXPIRES || '10s'

const app = fastify({
  logger: true, publicPath, secretJwt, pgConnect, salt, tokenExpires
})

app.listen(PORT, '0.0.0.0', err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
