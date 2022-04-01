import { signIn, signOut, checkStatus } from 'src/api/user'
import Api from 'src/helpers/Api'
const api = new Api()

export default class User {
  constructor (logger = console, storage = localStorage) {
    if (User.instance) return User.instance
    this.logger = logger
    this.storage = storage
    this.subscribes = []
    this._user = null
    this._username = storage.getItem('username')
    User.instance = this
  }

  onAuthChangeStatus (callback) {
    if (this.subscribes.includes(callback)) return
    this.subscribes.push(callback)
  }

  user () {
    return this._user
  }

  username () {
    return this._username
  }

  isLogin () {
    return !!this._user?.id
  }

  isAdmin () {
    return this._user?.userRole === 'admin'
  }

  async checkStatus () {
    return await checkStatus()
  }

  async signIn (username, password) {
    try {
      if (!username || !password) throw Error('Не заданы имя пользователя или пароль')
      this.logger.debug(`Попытка входа в программу пользователя ${username}`)
      this._username = username
      this.storage.setItem('username', username)
      const { token, refreshToken } = await signIn(username, password)
      this.storage.setItem('token', token)
      this.storage.setItem('refreshToken', refreshToken)
      api.setToken({ token, refreshToken })
      this.subscribes.forEach(el => el('SIGNED_IN', { username }))
    } catch (error) {
      this.logger.error(`Произошла оибка при попытке входа пользователя ${username} в систему`, error?.response?.data?.message || error.message)
      throw error
    }
  }

  /* async getProfile () {
    try {
      this.logger.debug(`Попытка загрузить профиль пользователя ${this._username}`)
      const { profile } = await this.api.getProfile()
      this._user = profile
    } catch (error) {
      this.logger.error(error.message)
    }
  } */

  async signOut () {
    try {
      this.logger.debug(`Выполняется выход из программы пользователя "${this._username}"`)
      await signOut(api.refreshToken)
      this._user = null
      api.setToken({ token: null, refreshToken: null })
      this.storage.removeItem('token')
      this.storage.removeItem('refreshToken')
      this.subscribes.forEach(el => el('SIGNED_OUT', { username: this._username }))
    } catch (error) {
      this.logger.error('Произошла оибка при попытке выхода текущего пользователя из системы', error?.response?.data?.message || error.message)
      throw error
    }
  }
}
