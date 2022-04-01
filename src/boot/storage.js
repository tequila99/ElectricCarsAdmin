import { boot } from 'quasar/wrappers'
import Storage from 'src/helpers/Storage'
import { storageSymbol } from 'src/api/symbols'
import Logger from 'src/helpers/Logger'
const logger = new Logger()

export default boot(async ({ app }) => {
  app.provide(storageSymbol, new Storage())
  logger.info('Начальная загрузка модуля хранилища')
})
