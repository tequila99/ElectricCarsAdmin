const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, done) {
  const { pg } = fastify

  const findOneById = async userId => {
    const { rowCount, rows } = await pg.query(`
SELECT * FROM auth_user WHERE user_id = $1 AND NOT deleted
    `,
    [
      userId
    ])
    if (!rowCount) throw new Error(`Не найден пользователь с ID ${userId}`)
    return rows[0]
  }

  const findOneByName = async userName => {
    const { rowCount, rows } = await pg.query(`
SELECT * FROM auth_user WHERE name = $1 AND active    
    `,
    [
      userName
    ])
    if (!rowCount) throw new Error(`Не найден активный пользователь с логином ${userName}`)
    return rows[0]
  }

  const findAll = async (q, lastName = '', lastId = '', limit = 100) => {
    const { rows } = await pg.query(`
SELECT a.* 
FROM auth_user AS a
WHERE NOT a.deleted
AND (a.name ~ $1 OR normalize_string(get_fullname(a.full_name)) ~ normalize_string($1))
AND row(normalize_string(get_fullname(a.full_name)), a.user_id) > row($2, $3::uuid)
ORDER BY normalize_string(get_fullname(a.full_name)), a.user_id
LIMIT $4    
    `,
    [
      q, lastName, lastId, limit
    ])
    return rows
  }

  const addOne = async user => {
    const {
      name, fullName, caption, userRole, mobilePhone, email
    } = user
    const { rows } = await pg.query(`
INSERT INTO auth_user (
  name, full_name, caption, user_role, mobile_phone, email
)  VALUES (
 $1, $2, $3, $4, $5, $6, $7
) RETURNING user_id    
    `,
    [
      name, fullName, caption, userRole, mobilePhone, email
    ])
    return rows[0]
  }

  const updateOne = async user => {
    const {
      userId, name, fullName, caption, userRole, mobilePhone, email, active
    } = user
    const { rows, rowCount } = await pg.query(`
UPDATE 
  auth_user SET 
  name = $2,
  full_name = $3,
  caption = $4,
  user_role = $5,
  mobile_phone = $6
  email = $7,
  active = $8
WHERE user_id = $1    
RETURNING *
    `,
    [
      userId, name, fullName, caption, userRole, mobilePhone, email, active
    ])
    if (!rowCount) throw new Error(`При обновлении не найден пользователь с ID: ${userId}`)
    return rows[0]
  }

  const deleteOne = async userId => {
    const { rows, rowCount } = await fastify.pg.query(`
  DELETE FROM auth_user WHERE  id = $1 RETURNING *
  `,
    [
      userId
    ])
    if (!rowCount) throw new Error(`При удалении не найден пользователь с ID ${userId}`)
    return rows[0]
  }

  fastify
    .decorate('userModule', {
      findOneById, findOneByName, findAll, addOne, updateOne, deleteOne
    })
  done()
})
