const path = require('path')
const Fastify = require('fastify')
const localize = require('ajv-i18n')
const pg = require('pg')
const injectPg = require('./lib/pgCamelcase')
injectPg(pg)

module.exports = opts => {
  const {
    logger = true,
    printRoutes = true,
    publicPath,
    pgConnect,
    secretJwt = 'secret',
    salt = 23,
    tokenExpires = '10m',
    sessionExpires = '1h',
    algorithm = 'HS512'
  } = opts

  const fastify = Fastify({
    logger,
    ajv: {
      ajv: {
        customOptions: {
          removeAdditional: true,
          useDefaults: true,
          coerceTypes: true,
          allErrors: true,
          nullable: true
        }
      }
    }
  })
    .register(require('fastify-postgres'), {
      connectionString: pgConnect,
      pg
    })
    .register(require('fastify-cors'))
    .register(require('./plugins/auth'), { 
      secretJwt,
      algorithm, 
      expiresIn: tokenExpires, 
      authorizationTokenExpiredMessage: 'Token expired',
      authorizationTokenInvalid: 'Invalid token'
    })
    .register(require('./plugins/bcrypt'), { salt })
    .register(require('./plugins/swagger'))
    .register(require('fastify-autoload'), {
      dir: path.join(__dirname, 'services'),
      options: { prefix: '/api/v1', tokenExpires, sessionExpires },
      dirNameRoutePrefix: (folderParent, folderName) => folderName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(),
      ignorePattern: /.*(test|spec|schema|test-module).js/
    })
    .register(require('fastify-static'), {
      root: publicPath
    })
    .setErrorHandler((error, request, reply) => {
      console.error(error)
      const { statusCode = 400, message, validation, validationContext } = error
      let response
      if (validation) {
        localize.ru(validation)
        response = {
          message: `Произошла ошибка при попытке проверить ${validationContext}...`,
          errors: validation.map(({ keyword, params, message }) => ({ keyword, message }))
        }
      } else {
        response = {
          message
        }
      }
      reply.status(statusCode).send(response)
    })

  fastify.ready(error => {
    if (error) console.error(error)
    if (printRoutes) console.log(fastify.printRoutes({ commonPrefix: false }))
  })

  return fastify
}
