const MongodbMemoryServer = require('mongodb-memory-server').default
const NodeEnvironment = require('jest-environment-node')

const mongod = new MongodbMemoryServer()

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    console.log('Setup MongoDB Test Environment')

    this.global.__MONGO_URI__ = `mongodb://localhost:${await mongod.getPort()}/`

    await super.setup()
  }

  async teardown() {
    console.log('Teardown MongoDB Test Environment')

    mongod.stop()

    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoEnvironment
