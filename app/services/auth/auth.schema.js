const STATUS_SUCCESS = 'Статус пользователя успешно проверен'
const TOKEN_SUCCESS = 'Сформирован токен авторизации для пользователя'
const SIGNOUT_SUCCESS = 'Сеанс пользователя успешно завершен'
const NOT_FOUND = 'Отстуствует действующий пользователь с указанным именем'
const NOT_AUTH = 'Невозможно авторизовать пользователя. Попробуйте заново войти в систему'
const FORBIDEN = 'Ошибка при авторизации пользователя. Неверный пароль'

const checkAuth = {
  tags: ['auht'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: true
        },
        message: {
          type: 'string',
          default: STATUS_SUCCESS
        }
      },
      required: ['success', 'message']
    },
    401: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean', default: false
        },
        message: {
          type: 'string',
          default: NOT_AUTH
        }
      }
    }
  }
}

const refreshToken = {
  tags: ['auth'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: true
        },
        message: {
          type: 'string',
          default: TOKEN_SUCCESS
        },
        token: {
          type: 'string',
          description: 'JWT токен авторизации'
        },
        refreshToken: {
          type: 'string',
          description: 'Токен для обновления авторизации'
        }
      },
      required: ['success', 'message', 'token']
    },
    401: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean', default: false
        },
        message: {
          type: 'string',
          default: NOT_AUTH
        }
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        description: 'Токен для обновления, содержащий информацию о сессии пользователя'
      }
    }
  }
}

const signOut = {
  tags: ['auth'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: true
        },
        message: {
          type: 'string',
          default: SIGNOUT_SUCCESS
        }
      },
      required: ['success', 'message']
    }
  },
  body: {
    type: 'object',
    properties: {
      token: { 
        type: 'string', 
        description: 'Токен для обновления, содержащий информацию о сессии пользователя' 
      }
    },
    required: ['token']
  }
}

const signIn = {
  tags: ['auth'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: true
        },
        message: {
          type: 'string',
          default: TOKEN_SUCCESS
        },
        token: {
          type: 'string',
          description: 'JWT токен авторизации'
        },
        refreshToken: {
          type: 'string',
          description: 'Токен для обновления авторизации'
        }
      },
      required: ['success', 'message', 'token']
    },
    404: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean', default: false
        },
        message: {
          type: 'string',
          default: NOT_FOUND
        }
      }
    },
    403: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean', default: false
        },
        message: {
          type: 'string',
          default: FORBIDEN
        }
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', description: 'Имя пользователя для получения токена' },
      password: { type: 'string', description: 'Пароль пользователя для получения токена' }
    },
    required: ['username', 'password']
  }
}

module.exports = {
  signIn,
  signOut,
  refreshToken,
  checkAuth
}
