const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next) {
  fastify.register(require('fastify-swagger'), {
    routePrefix: '/api-doc',
    swagger: {
      info: {
        title: 'ЭлектроСити',
        description: 'Описание вызовов API проекта ЭлектроСити',
        version: '0.1.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Больше информации'
      },
      host: 'localhost:3600',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Авторизация, обновление токена, выход из системы' },
        { name: 'user', description: 'Операции со списком пользователей' }
        // { name: 'federalSubjects', description: 'Операции со справочником федеральных субъектов' },
        // { name: 'territoryOkato', description: 'Операции со справочником территорий (областей) ОКАТО' },
        // { name: 'organizations', description: 'Операции со справочником медицинских организхаций (ФРМО)' }
      ]
    },
    exposeRoute: true
  })

  next()
}, { name: 'swagger' })
