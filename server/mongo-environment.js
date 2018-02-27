const NodeEnvironment = require('jest-environment-node')

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    console.log('Setup MongoDB Test Environment')

    const port = await global.__MONGOD__.getPort()
    this.global.__MONGO_URI__ = `mongodb://localhost:${port}/`

    await super.setup()
  }

  async teardown() {
    console.log('Teardown MongoDB Test Environment')

    global.__MONGOD__.stop()

    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoEnvironment
