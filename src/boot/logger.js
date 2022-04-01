import { boot } from 'quasar/wrappers'
import { logSymbol } from 'src/api/symbols'
import Logger from 'src/helpers/Logger'
const logger = new Logger()

export default boot(async ({ app, router }) => {
  router.beforeEach((to, from, next) => {
    logger.debug(`Переход в приложении с ${from.fullPath} на ${to.fullPath}`)
    return next()
  })
  app.provide(logSymbol, logger)
  logger.info('начальная загрузка модуля логгирования')
})
