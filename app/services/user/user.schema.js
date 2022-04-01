const LIST_SUCCESS = 'Загружен список пользователей из справочника'
const GET_SUCCESS = 'Загружена информация о пользователе с указанным ID'
const ADD_SUCCESS = 'Добавлена запись в справочник пользователей'
const UPDATE_SUCCESS = 'Изменена запись в справочнике пользователей'
const DELETE_SUCCESS = 'Из справочника пользователей удалена запись с указанным ID'
const NOT_FOUND = 'В справочнике отсутствует запись о пользователе с указанным ID'

const profile = {
  tags: ['user'],
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
          default: GET_SUCCESS
        },
        user: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'Уникальный ID пользователя' },
            name: { type: 'string', description: 'Имя (логин) пользователя' },
            fullName: {
              type: 'object',
              description: 'ФИО пользователя',
              properties: {
                lastName: { type: 'string', description: 'Фамилия пользователя' },
                firstName: { type: 'string', description: 'Имя пользователя' },
                middleName: { type: 'string', description: 'Отчество пользователя' }
              },
              required: ['lastName', 'firstName']
            },
            caption: { type: 'string', default: '', description: 'Описание (комментарий) к записи пользователя' },
            mobilePhone: { type: 'string', default: '', description: 'Мобильный телефон пользователя' },
            email: { type: 'string', default: '', description: 'Адрес электронной почты пользователя' },
            active: { type: 'boolean', description: 'Признак действующей записи пользователя' },
            userRole: { type: 'string', description: 'Уровень доступа пользователя' },
            avatar: { type: 'string', description: 'Путь к файлу автара пользователя' },
            thmbAvatar: { type: 'string', description: 'Путь к уменьшенному аватару пользователя' }
          },
          required: ['userId', 'name', 'fullName', 'mobilePhone', 'email', 'active', 'userRole']
        }
      }
    },
    404: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: false
        },
        message: {
          type: 'string',
          default: NOT_FOUND
        }
      }
    }    
  }
}

const findAll = {
  tags: ['user'],
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
          default: LIST_SUCCESS
        },
        users: {
          type: 'array',
          items: {
            properties: {
              userId: { type: 'string', description: 'Уникальный ID пользователя' },
              name: { type: 'string', description: 'Логин пользователя' },
              fullName: {
                type: 'object',
                description: 'ФИО пользователя',
                properties: {
                  lastName: { type: 'string', description: 'Фамилия пользователя' },
                  firstName: { type: 'string', description: 'Имя пользователя' },
                  middleName: { type: 'string', description: 'Отчество пользователя' }
                },
                required: ['lastName', 'firstName']
              },
              caption: { type: 'string', default: '', description: 'Описание пользователя' },
              mobilePhone: { type: 'string', default: '', description: 'Мобильный телефон пользователя' },
              email: { type: 'string', default: '', description: 'Адрес электронной почты пользователя' },
              active: { type: 'boolean', description: 'Признак действующей записи пользователя' },
              userRole: { type: 'string', description: 'Уровни доступа пользователей (администратор, оператор)' },
              thmbAvatar: { type: 'string', description: 'Путь к уменьшенному аватару пользователя' }
            },
            required: ['userId', 'name', 'fullName', 'mobilePhone', 'email', 'active', 'userRole']
          }
        }
      }
    }
  },
  query: {
    type: 'object',
    properties: {
      q: { type: 'string', default: '', description: 'Строка для поиска' },
      lastName: { type: 'string', default: '', description: 'Наименования для реализации пагинации по страницам' },
      lastId: { type: 'string', default: '00000000-0000-0000-0000-000000000000', description: 'Идентификатор для реализации пагинации по страницам' },
      limit: { type: 'integer', default: 100, description: 'Ограничение по размеру выборки из справочника пользователей' }
    },
    required: ['q', 'lastName', 'lastId', 'limit']
  }
}

const findOne = {
  tags: ['user'],
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
          default: GET_SUCCESS
        },
        user: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'Уникальный ID пользователя' },
            name: { type: 'string', description: 'Имя (логин) пользователя' },
            fullName: {
              type: 'object',
              description: 'ФИО пользователя',
              properties: {
                lastName: { type: 'string', description: 'Фамилия пользователя' },
                firstName: { type: 'string', description: 'Имя пользователя' },
                middleName: { type: 'string', description: 'Отчество пользователя' }
              },
              required: ['lastName', 'firstName']
            },
            caption: { type: 'string', default: '', description: 'Описание (комментарий) к записи пользователя' },
            mobilePhone: { type: 'string', default: '', description: 'Мобильный телефон пользователя' },
            email: { type: 'string', default: '', description: 'Адрес электронной почты пользователя' },
            active: { type: 'boolean', description: 'Признак действующей записи пользователя' },
            userRole: { type: 'string', description: 'Уровень доступа пользователя' },
            avatar: { type: 'string', description: 'Путь к файлу автара пользователя' },
            thmbAvatar: { type: 'string', description: 'Путь к уменьшенному аватару пользователя' }
          },
          required: ['userId', 'name', 'fullName', 'mobilePhone', 'email', 'active', 'userRole']
        }
      }
    },
    404: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: false
        },
        message: {
          type: 'string',
          default: NOT_FOUND
        }
      }
    }
  },
  params: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'ID запрашиваемого пользователя'
      }
    },
    required: ['userId']
  }
}

const addOne = {
  tags: ['user'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: true
        },
        message: {
          type: 'boolean',
          default: ADD_SUCCESS
        },
        user: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'ID обновленного пользователя' }
          }
        }
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Имя (логин) пользователя' },
      fullName: {
        type: 'object',
        description: 'ФИО пользователя',
        properties: {
          lastName: { type: 'string', description: 'Фамилия пользователя' },
          firstName: { type: 'string', description: 'Имя пользователя' },
          middleName: { type: 'string', description: 'Отчество пользователя' }
        },
        required: ['lastName', 'firstName']
      },
      caption: { type: 'string', default: '', description: 'Описание пользователя' },
      mobilePhone: { type: 'string', default: '', description: 'Мобильный телефон пользователя' },
      email: { type: 'string', default: '', description: 'Адрес электронной почты пользователя' },
      active: { type: 'boolean', description: 'Признак действующей записи пользователя' },
      userRole: { type: 'string', description: 'Уровни доступа пользователей (администратор, оператор)' }
    },
    required: ['name', 'fullName', 'caption', 'userRole', 'mobilePhone', 'email']
  }
}

const updateOne = {
  tags: ['user'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: true
        },
        message: {
          type: 'boolean',
          default: UPDATE_SUCCESS
        },
        user: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'Уникальный ID пользователя' },
      name: { type: 'string', description: 'Имя (логин) пользователя' },
      fullName: {
        type: 'object',
        description: 'ФИО пользователя',
        properties: {
          lastName: { type: 'string', description: 'Фамилия пользователя' },
          firstName: { type: 'string', description: 'Имя пользователя' },
          middleName: { type: 'string', description: 'Отчество пользователя' }
        },
        required: ['lastName', 'firstName']
      },
      caption: { type: 'string', default: '', description: 'Описание (комментарий) к записи пользователя' },
      userRole: { type: 'string', description: 'Признак действующей записи пользователя' },
      mobilePhone: { type: 'string', default: '', description: 'Мобильный телефон пользователя' },
      email: { type: 'string', default: '', description: 'Адрес электронной почты пользователя' }
    },
    required: ['userId', 'name', 'fullName', 'caption', 'userRole', 'mobilePhone', 'email']
  }
}

const deleteOne = {
  tags: ['user'],
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
          default: DELETE_SUCCESS
        },
        user: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
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
    }
  },
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'ID удаляемого пользователя' }
    },
    required: ['userId']
  }
}

module.exports = {
  findAll, findOne, addOne, updateOne, deleteOne, profile
}
