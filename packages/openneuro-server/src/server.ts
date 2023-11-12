/** Needs to run before the other imports in Node */
import apm from "elastic-apm-node"
apm.start({
  serviceName: "openneuro-server",
  cloudProvider: "none",
})

import { createServer } from "http"
import mongoose from "mongoose"
import { connect as redisConnect } from "./libs/redis"
import config from "./config"
import { expressApolloSetup } from "./app"

const redisConnectionSetup = async () => {
  try {
    await redisConnect(config.redis)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

void mongoose.connect(config.mongo.url, {
  dbName: config.mongo.dbName,
  connectTimeoutMS: config.mongo.connectTimeoutMS,
})

void redisConnectionSetup().then(async () => {
  const app = await expressApolloSetup()
  const server = createServer(app)
  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log("Server is listening on port " + config.port)
    // Setup GraphQL subscription transport
    //subscriptionServerFactory(server)
  })
})
