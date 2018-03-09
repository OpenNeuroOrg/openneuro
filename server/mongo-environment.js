const MongodbMemoryServer = require('mongodb-memory-server').default
const NodeEnvironment = require('jest-environment-node')

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
    this.mongod = new MongodbMemoryServer()
  }

  async setup() {
    this.global.__MONGO_URI__ = `mongodb://localhost:${await this.mongod.getPort()}/`

    await super.setup()
  }

  async teardown() {
    this.mongod.stop()

    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoEnvironment
