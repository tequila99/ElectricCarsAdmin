import axios from 'axios'

export default class Api {
  constructor (logger = console, storage = localStorage, opts = {}) {
    if (Api.instance) return Api.instance
    this.client = opts.client || axios.create({
      headers: { 'content-type': 'application/json', accept: 'application/json' }
    })
    this.storage = storage
    this.logger = logger
    this.token = opts.tokem || this.storage.getItem('token') || ''
    this.refreshToken = opts.token || this.storage.getItem('refreshToken') || ''
    this.client.interceptors.request.use(
      config => {
        if (!this.token) return config
        const newConfig = {
          headers: {},
          ...config
        }
        newConfig.headers.Authorization = `Bearer ${this.token}`
        return newConfig
      },
      e => Promise.reject(e)
    )
    this.client.interceptors.response.use(
      r => r,
      async error => {
        if (error.response.status === 401 && !error.config.retry) {
          if (['Token expired', 'Invalid token'].includes(error.response?.data?.message)) {
            logger.debug('Попытка обновить токен авторизации')
            const { data } = await this.client.post('/api/v1/auth/refresh', {
              refreshToken: this.refreshToken
            })
            this.setToken(data)
            const newRequest = {
              ...error.config,
              retry: true
            }
            return this.client(newRequest)
          }
          if (['Access forbidden'].includes(error.response?.data?.message)) {
            logger.error('Недостаточно прав для выпонения операции', 'Возможно требуется повторный вход в систему')
          }
        }
        throw error
      }
    )
  }

  setToken ({ token, refreshToken }) {
    this.token = token
    this.refreshToken = refreshToken
    this.storage.setItem('token', token)
    this.storage.setItem('refreshToken', refreshToken)
    this.logger.debug('Токен доступа успешно обновлен')
  }
}
