const path = require('path')
const Fastify = require('fastify')
const localize = require('ajv-i18n')
const pg = require('pg')
const injectPg = require('./lib/pgCamelcase')
injectPg(pg)

module.exports = opts => {
  const {
    logger = true,
    prinRoutes = false,
    publicPath
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
    .register(require('fastify-cors'))
    .register(require('fastify-autoload'), {
      dir: path.join(__dirname, 'services'),
      options: { prefix: '/api/v1' },
      dirNameRoutePrefix: (folderParent, folderName) => folderName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(),
      ignorePattern: /.*(test|spec|schema|test-module).js/
    })
    .register(import('fastify-static'), {
      root: publicPath
    })
    .setErrorHandler((error, request, reply) => {
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
    if (prinRoutes) console.log(fastify.prinRoutes({ commonPrefix: false }))
  })

  return fastify
}
