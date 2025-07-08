import "./sentry"
import "./libs/redis"
import config from "./config"
import { createServer } from "http"
import mongoose from "mongoose"
import { expressApolloSetup } from "./app"
import { initQueues } from "./queues/setup"

void mongoose.connect(config.mongo.url, {
  dbName: config.mongo.dbName,
  connectTimeoutMS: config.mongo.connectTimeoutMS,
})

async function init() {
  // Start redis message queues
  initQueues()
  const app = await expressApolloSetup()
  const server = createServer(app)
  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log("Server is listening on port " + config.port)
    // Setup GraphQL subscription transport
    //subscriptionServerFactory(server)
  })
}

init()
