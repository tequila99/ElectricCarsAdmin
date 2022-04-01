import { boot } from 'quasar/wrappers'
import Api from 'src/helpers/Api'
import Logger from 'src/helpers/Logger'
import Storage from 'src/helpers/Storage'
const logger = new Logger()
const api = new Api(new Logger(), new Storage())

export default boot(({ router }) => {
  api.client.interceptors.response.use(
    r => r,
    async error => {
      console.log(111111111111111)
      logger.debug('Попытка обновить токен авторизации')
      if (error.response.status !== 401) throw error
      // if (error.response.status === 401 && !error.config.retry) {
      //   if (['Token expired', 'Invalid token'].includes(error.response?.data?.message)) {
      //     logger.debug('Попытка обновить токен авторизации')
      //     const { data } = await api.client.post('/api/v1/auth/refresh', {
      //       refreshToken: api.refreshToken
      //     })
      //     api.setToken(data)
      //     const newRequest = {
      //       ...error.config,
      //       retry: true
      //     }
      //     return api.client(newRequest)
      //   }
      //   if (['Access forbidden'].includes(error.response?.data?.message)) {
      //     logger.error('Ошибка авторизации. Необходим повторный воход в систему', 'Войдите в систему заново')
      //     router.push({ path: '/login' })
      //   }
      // }
      // throw error
    }
  )
  // console.log(api.client.interceptors.response)
  logger.info('Начальная загрузка модуля axios')
})
