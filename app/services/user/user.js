const { findAll, findOne, addOne, updateOne, deleteOne, profile } = require('./user.schema.js')

module.exports = async (fastify, opts) => {
  fastify
    .register(require('../../plugins/modules/user/user.js'))
    .get('/:userId', { schema: findOne, preValidation: [fastify.authenticate] }, async (req, reply) => {
      const { userModule } = fastify
      const { userId } = req.params
      const user = await userModule.findOneById(userId)
      return { user }
    })

    .get('/', { schema: findAll, preValidation: [fastify.authenticate] }, async (req, reply) => {
      const { userModule } = fastify
      const { q, lastName, lastId, limit } = req.query
      const users = await userModule.findAll(q, lastName, lastId, limit)
      return { users }
    })

    .post('/', { schema: addOne, preValidation: [fastify.authenticate, fastify.isAdmin] }, async (req, reply) => {
      const { userModule } = fastify
      const user = await userModule.addOne(req.body)
      return { user }
    })

    .put('/', { schema: updateOne, preValidation: [fastify.authenticate, fastify.isAdmin] }, async (req, reply) => {
      const { userModule } = fastify
      const user = await userModule.updateOne(req.body)
      return { user }
    })

    .delete('/:userId', { schema: deleteOne, preValidation: [fastify.authenticate, fastify.isAdmin] }, async (req, reply) => {
      const { userModule } = fastify
      const { userId: id } = req.params
      const user = await userModule.deleteOne(id)
      return { user }
    })

    .get('/profile', { schema: profile, preValidation: [fastify.authenticate] }, async (req, reply) => {
      const { userModule } = fastify
      const { userId } = req.user
      const user = await userModule.findOneById(userId)
      return { user }
    })
}
