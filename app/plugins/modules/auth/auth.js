const fp = require('fastify-plugin')

module.exports = fp((fastify, opts, done) => {
  const { pg } = fastify
  const addSession = async (userId, payload) => {
    const { rows } = await pg.query(`
INSERT INTO auth_session (user_id, payload)    
VALUES ($1, $2) RETURNING session_id
    `,
    [
      userId, payload
    ])
    const session = rows[0].sessionId
    return session
  }
  const removeSession = async session => {
    await pg.query(`
DELETE FROM auth_session WHERE session_id = $1    
    `,
    [
      session
    ])
  }
  const getSession = async session => {
    console.log(session)
    const { rowCount, rows } = await pg.query(`
SELECT payload FROM auth_session WHERE session_id = $1
    `,
    [
      session
    ])
    if (!rowCount) throw new Error('Не найдена действующая сессия для пользователя. Повторите вход в систему')
    const { userId } = rows[0].payload
    return { userId, payload: rows[0].payload }
  }
  fastify
    .decorate('authModule', {
      addSession, removeSession, getSession
    })
  done()
})
