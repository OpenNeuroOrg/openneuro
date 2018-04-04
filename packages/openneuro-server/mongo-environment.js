const MongodbMemoryServer = require('mongodb-memory-server').default
const NodeEnvironment = require('jest-environment-node')

const mongod = new MongodbMemoryServer()

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
    this.mongod = mongod
  }

  async setup() {
    this.global.__MONGO_URI__ = `mongodb://localhost:${await this.mongod.getPort()}/`

    await super.setup()
  }

  async teardown() {
    //this.mongod.stop()

    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoEnvironment
