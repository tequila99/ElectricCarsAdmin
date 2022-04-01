// const { v4 } = require('uuid')
const { signIn, signOut, refreshToken, checkAuth } = require('./auth.schema.js')

module.exports = async (fastify, opts) => {
  // Авторизация
  //

  fastify
    .register(require('../../plugins/modules/auth/auth'))
    .register(require('../../plugins/modules/user/user'))
    .post('/', { schema: signIn }, async (req, reply) => {
      const { bcrypt, jwt, userModule, authModule } = fastify
      const { username, password } = req.body
      const { userId, name: userName, userRole, password: currentPassword } = await userModule.findOneByName(username)
      if (!await bcrypt.compare(password, currentPassword)) {
        reply.code(403)
        return new Error(`Ошибка при авторизации пользователя с именем: ${req.body.username}. Неверный пароль`)
      }
      const payload = { userId, userName, userRole }
      const session = await authModule.addSession(userId, payload)
      console.log(session)
      const token = await jwt.sign(payload, { expiresIn: opts.tokenExpires || '10m' })
      const refreshToken = await jwt.sign({ session }, { expiresIn: opts.sessionExpires || '1h' })

      return { message: `Пользователь ${req.body.username} успешно авторизован`, token, refreshToken }
    })
    // выход из системы, удаляется инфомрация о сессии
    //
    .post('/logout', { schema: signOut }, async (req, reply) => {
      const { jwt, authModule } = fastify
      const { token } = req.body
      const { session } = jwt.decode(token)
      await authModule.removeSession(session)

      return { message: 'Пользователь успешно вышел из системы' }
    })
  // Обновление токена
  //
    .post('/refresh', { schema: refreshToken }, async (req, reply) => {
      const { jwt, authModule } = fastify
      const { refreshToken: rf } = req.body
      console.log(rf)
      const data = await jwt.verify(rf)
      console.log(data)
      const { userId, payload } = await authModule.getSession(data.session)
      await authModule.removeSession(data.session)
      const session = await authModule.addSession(userId, payload)
      const token = await jwt.sign(payload)
      const refreshToken = await jwt.sign({ session }, { expiresIn: '1h' })
      return { message: 'Токен авторизации успешно обновлен', token, refreshToken }
    })
  // проверка статуса пользователя
  //
    .post('/status', { schema: checkAuth, preValidation: [fastify.authenticate] }, async (req, reply) => {      
      return { status: true, message: `Статус пользователя ${req.user.userName} успешно проверен` }
    })
}
