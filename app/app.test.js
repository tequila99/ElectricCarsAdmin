require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
const { hash } = require('bcryptjs')
const { test } = require('tap')
const { validate } = require('uuid')

const TEST_PASSWORD = 'password'
const SALT = process.env.SALT || 10
// путь к каталогу где содержаться скрипты для создания базы данных
const DB_PATH = 'db/'

// пути к скриптам инициализации базы данных
const CREATE_USER_DB = fs.readFileSync(
  path.join(DB_PATH, 'createDb.sql'),
  'utf8'
)
const CREATE_SCHEMA_DB = fs.readFileSync(
  path.join(DB_PATH, 'createSchema.sql'),
  'utf8'
)
const CREATE_FUNCTION = fs.readFileSync(
  path.join(DB_PATH, 'createFunctions.sql'),
  'utf8'
)

// путь к скрипту создания таблицы пользователей
const CREATE_USER = fs.readFileSync(
  path.join(DB_PATH, 'auth/createUser.sql'),
  'utf8'
)

test('Проверка создания базы данных', async (t) => {
  let pool
  t.before(() => {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_SYSTEM_NAME,
      user: process.env.DB_SYSTEM_USER,
      password: process.env.DB_SYSTEM_PASS
    })
  })

  t.teardown(() => {
    pool.end()
  })

  t.test('удаление старой версии БД при наличии', async (t) => {
    const result = await pool.query('DROP DATABASE IF EXISTS electrocar;')
    t.has(result, { rowCount: null, rows: [] }, 'выполнено успешно')
  })

  t.test('создание новой версии базы данных', async (t) => {
    const result = await pool.query('CREATE DATABASE electrocar')
    t.has(result, { rowCount: null, rows: [] }, 'выполнено успешно')
  })

  t.test('создание пользователя БД', async (t) => {
    const result = await pool.query(CREATE_USER_DB)
    t.equal(result.length, 3, 'все команды выполнены')
    t.has(result[0], { rowCount: null, rows: [] }, 'изменен временной пояс')
    t.has(
      result[1],
      { rowCount: null, rows: [] },
      'очищена информация о пользователе'
    )
    t.has(result[2], { rowCount: null, rows: [] }, 'создан новый пользователь')
  })
})

test('Создание расширения и схемы', async (t) => {
  let pool

  t.before(() => {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: 'electrocar',
      user: process.env.DB_SYSTEM_USER,
      password: process.env.DB_SYSTEM_PASS
    })
  })

  t.teardown(() => {
    pool.end()
  })

  t.test('проверка создания расширений и схемы', async (t) => {
    const result = await pool.query(CREATE_SCHEMA_DB)
    t.equal(result.length, 2, 'все команды выполнены')
    t.has(result[0], { rowCount: null, rows: [] }, 'создано расширение')
    t.has(result[1], { rowCount: null, rows: [] }, 'создана схема авторизации')
  })
})

test('проверка создания пользовательских функций', async (t) => {
  let pool

  t.before(() => {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: 'electrocar',
      user: 'electrocar',
      password: 'electrocar'
    })
  })

  t.teardown(() => {
    pool.end()
  })

  t.test('создание функций', async (t) => {
    const result = await pool.query(CREATE_FUNCTION)
    t.equal(result.length, 10, 'все функции созданы')
  })
})

test('проверка создания справочников', (t) => {
  let pool

  t.before(() => {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: 'electrocar',
      user: 'electrocar',
      password: 'electrocar'
    })
  })

  t.teardown(() => {
    pool.end()
  })

  t.test('создание справочника пользователей', async (t) => {
    const result = await pool.query(CREATE_USER)
    t.equal(result.length, 35, 'справочник пользователей создан')
  })

  t.test(
    'добавление и удаление пользователя с правами администратора',
    async (t) => {
      const pass = await hash(TEST_PASSWORD, SALT)
      const { rowCount, rows } = await pool.query(
        `
INSERT INTO auth_user (name, full_name, caption, password, user_role)    
VALUES( 'Admin', $1::jsonb, 'Встроенная учетная запись администратора', $2, 'admin')
RETURNING id, active, deleted;
    `,
        [
          JSON.stringify({
            lastName: 'Встроенная учетная запись администратора',
            firstName: '',
            middleName: ''
          }),
          pass
        ]
      )
      t.equal(rowCount, 1, 'запись добавлена')
      t.equal(
        validate(rows[0].id),
        true,
        'код нового пользователя является валидным UUID'
      )
      t.equal(rows[0].active, true, 'пользователь по умолчанию активен')
      t.equal(
        rows[0].deleted,
        false,
        'пользователь по умолчанию не помечен на удаление'
      )
      t.end()
    }
  )

  t.test(
    'добавление и удаление пользователя с правами администратора',
    async (t) => {
      const pass = await hash(TEST_PASSWORD, SALT)
      const { rows } = await pool.query(
        `
INSERT INTO auth_user (name, full_name, caption, password, user_role)    
VALUES( 'Admin-deleted', $1::jsonb, 'Встроенная учетная запись администратора', $2, 'admin')
RETURNING id, active, deleted;
    `,
        [
          JSON.stringify({
            lastName: 'Встроенная учетная запись администратора',
            firstName: '',
            middleName: ''
          }),
          pass
        ]
      )
      const userId = rows[0].id

      await pool.query(
        `
DELETE FROM  auth_user WHERE id = $1;
    `,
        [userId]
      )
      const { rowCount, rows: rowsDelete } = await pool.query(
        `
SELECT active, deleted  FROM auth_user WHERE id = $1    
    `,
        [userId]
      )
      t.equal(rowCount, 1, 'запись сохранена в базе')
      t.equal(rowsDelete[0].active, false, 'удаленный пользователь неактивен')
      t.equal(
        rowsDelete[0].deleted,
        true,
        'удаленный пользователь помечен на удаление'
      )
      t.end()
    }
  )

  t.end()
})
