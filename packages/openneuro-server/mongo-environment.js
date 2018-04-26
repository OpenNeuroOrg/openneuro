const MongodbMemoryServer = require('mongodb-memory-server').default
const NodeEnvironment = require('jest-environment-node')

const mongod = new MongodbMemoryServer()

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    this.global.__MONGO_URI__ = `mongodb://localhost:${await mongod.getPort()}/`

    await super.setup()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoEnvironment
