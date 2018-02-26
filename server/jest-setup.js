const MongodbMemoryServer = require('mongodb-memory-server').default
const mongod = new MongodbMemoryServer()

module.exports = () => {
  global.__MONGOD__ = mongod
}
