const fp = require('fastify-plugin')
const fastifyJwt = require('fastify-jwt')

module.exports = fp((fastify, opts, done) => {
  fastify
    .register(fastifyJwt, {
      secret: opts.secretJwt || 'secret',
      messages: {
        badRequestErrorMessage: opts.badRequestErrorMessage || 'Формат заголовка авторизации: Bearer [token]',
        noAuthorizationInHeaderMessage: opts.noAuthorizationInHeaderMessage || 'Отсутствует заголовок авторизации',
        authorizationTokenExpiredMessage: opts.authorizationTokenExpiredMessage || 'Срок действия токена истек',
        authorizationTokenInvalid: err => opts.authorizationTokenInvalid || `Ошибка в токене авторизации: ${err.message}`
      },
      sign: {
        algorithm: opts.algorithm || 'HS512',
        expiresIn: opts.expiresIn || 6000
      }

    })
    .decorate('authenticate', async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    })
    .decorate('isAdmin', (request, reply, done) => {
      if (!request.user) {
        reply.code(401)
        done(new Error(opts.noUserAuthMessage || 'Пользователь не авторизован'))
      }
      if (request.user.userRole !== 'admin') {
        reply.code(403)
        done(new Error(opts.noUserAdminMessage || `Пользователь ${request.user.userName} не обладает правами администратора`))
      }
      done()
    })
    .decorate('isRoot', (request, reply, done) => {
      if (!request.user) {
        reply.code(403)
        done(new Error(opts.noUserAuthMessage || 'Пользователь не авторизован'))
      }
      if (+request.user.userId !== 1 || request.user.userType !== 'admin') {
        reply.code(403)
        done(new Error(opts.noUserRootMessage || `Пользователь ${request.user.userName} не обладает правами суперпользователя`))
      }
      done()
    })
  done()
})
