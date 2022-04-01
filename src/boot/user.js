import { boot } from 'quasar/wrappers'
import User from 'src/models/User'
import Logger from 'src/helpers/Logger'
import Storage from 'src/helpers/Storage'
import { userSymbol } from 'src/api/symbols'

const logger = new Logger()
const storage = new Storage()
const user = new User(logger, storage)

export default boot(async ({ app, router }) => {
  user.onAuthChangeStatus(async (event, { username }) => {
    if (event === 'SIGNED_IN') {
      logger.debug(`Пользователь ${username} успешно вошел в систему`)
      // await user.getProfile()
      return router.push({ path: '/' })
    }
    if (event === 'SIGNED_OUT') {
      logger.debug(`Пользователь ${username} успешно вышел в систему`)
      return router.push({ path: '/login' })
    }
    if (event === 'USER_UPDATED') {
      // nothing
    }
  })
  router.beforeEach((to, from, next) => {
    const authRequired = to.matched.some(route => route.meta.authRequired)
    const adminRequired = to.matched.some(route => route.meta.adminRequired)
    if (adminRequired && !user.isAdmin()) return next(false)
    if (authRequired && !user.isLogin()) return next(false)
    return next()
  })
  // await user.getProfile()
  app.provide(userSymbol, user)
  try {
    await user.checkStatus()
  } catch (error) {
    console.error(error)
    return router.push({ path: '/login' })
  }
  // if (!user.isLogin()) return router.push({ path: '/login' })
})
