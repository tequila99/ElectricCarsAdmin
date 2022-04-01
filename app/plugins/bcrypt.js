const fp = require('fastify-plugin')
const bcrypt = require('bcryptjs')

module.exports = fp(function (fastify, opts, next) {
  const salt = opts.salt || 10
  const hash = async pwd => bcrypt.hash(pwd, salt)
  const compare = async (claim1, claim2) => bcrypt.compare(claim1, claim2)

  fastify
    .decorate('bcrypt', {
      hash,
      compare
    })
    .decorateRequest('bcryptHash', hash)
    .decorateRequest('bcryptCompare', compare)

  next()
})
