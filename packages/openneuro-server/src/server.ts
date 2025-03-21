import "./sentry"
import config from "./config"
import { createServer } from "http"
import mongoose from "mongoose"
import { connect as redisConnect, redis } from "./libs/redis"
import { expressApolloSetup } from "./app"
import { WebSocketServer } from "ws"
import cors from "cors" // Import cors

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
  app.use(cors({
    origin: "http://localhost:9876",
  }))

  const wss = new WebSocketServer({ server })

  wss.on("listening", () => {
    console.log("Websocket server listening on port:", config.port)
  })
  wss.on("connection", (ws) => {
    console.log("Websocket client connected.")
    const redisSubscriber = redis.duplicate()
    redisSubscriber.subscribe("validation-completed")
    redisSubscriber.on("message", (channel, message) => {
      console.log("Server: Message from redis to client:", message)
      ws.send(message)
    })
    ws.on("close", () => {
      console.log("Websocket client disconnected.")
      redisSubscriber.unsubscribe("validation-completed")
      redisSubscriber.quit()
    })
    ws.on("error", (error) => {
      console.error("Websocket server error:", error)
    })
  })
  server.on("error", (error) => {
    console.error("Server error:", error)
  })
  server.listen(config.port, () => {
    console.log("Server is listening on port " + config.port)
  })
})
