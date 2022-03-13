const camelCase = str => str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase())

module.exports = function (pg) {
  const queryProto = pg.Query.prototype
  const handleRowDesc = queryProto.handleRowDescription
  queryProto.handleRowDescription = function (msg) {
    msg.fields.forEach(field => { field.name = camelCase(field.name) })
    return handleRowDesc.call(this, msg)
  }
}
