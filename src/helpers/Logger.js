import { Notify } from 'quasar'

export default class Logger {
  constructor () {
    if (Logger.instance) return Logger.instance
    Logger.instance = this
  }

  info (msg) {
    console.info(`[INFO] ${msg}`)
  }

  error (message, caption = '') {
    console.error(`[ERROR] ${message}`)
    Notify.create({
      type: 'negative',
      message: message || 'Произошла ошибка при попытке выполнения операции',
      caption: caption,
      position: 'bottom-right',
      icon: 'error_outline',
      iconSize: 'red-6'
    })
  }

  warn (message) {
    console.warn(`[WARN] ${message}`)
  }

  debug (message) {
    console.info(`[DEBUG] ${message}`)
  }
}
