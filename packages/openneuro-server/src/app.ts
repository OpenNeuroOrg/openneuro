/*eslint no-console: ["error", { allow: ["log"] }] */
/**
 * Express app setup
 */
import { createServer } from "http"
import cors from "cors"
import express, { json, urlencoded } from "express"
import passport from "passport"
import config from "./config"
import routes from "./routes"
import morgan from "morgan"
import schema from "./graphql/schema"
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { KeyvAdapter } from "@apollo/utils.keyvadapter"
import Keyv from "keyv"
import KeyvRedis from "@keyv/redis"
import cookieParser from "cookie-parser"
import * as jwt from "./libs/authentication/jwt"
import * as auth from "./libs/authentication/states"
import { sitemapHandler } from "./handlers/sitemap"
import { setupPassportAuth } from "./libs/authentication/passport"
import { redis } from "./libs/redis"
import { version } from "./lerna.json"
export { Express } from "express-serve-static-core"

interface OpenNeuroRequestContext {
  user: string
  isSuperUser: boolean
  userInfo: {
    id: string
    exp: string
    scopes: string[]
  }
}

export async function expressApolloSetup() {
  const app = express()

  setupPassportAuth()

  app.use(passport.initialize())

  app.use((req, res, next) => {
    res.set(config.headers)
    res.type("application/json")
    next()
  })
  app.use(morgan("short"))
  app.use(cookieParser())
  app.use(urlencoded({ extended: false, limit: "100mb" }))
  app.use(json({ limit: "100mb" }))

  // routing ---------------------------------------------------------
  app.use("/sitemap.xml", sitemapHandler)
  app.use(config.apiPrefix, routes)
  app.use("/api/", routes)

  const httpServer = createServer(app)

  // Apollo server setup
  const apolloServer = new ApolloServer<OpenNeuroRequestContext>({
    schema,
    // Always allow introspection - our schema is public
    introspection: true,
    // @ts-expect-error Type mismatch for keyv and ioredis recent releases
    cache: new KeyvAdapter(new Keyv({ store: new KeyvRedis(redis) })),
    plugins: [
      ApolloServerPluginLandingPageLocalDefault(),
      ApolloServerPluginDrainHttpServer({
        httpServer,
      }),
      {
        async requestDidStart() {
          return {
            async willSendResponse(requestContext) {
              const { response } = requestContext
              if (
                response.body.kind === "single" &&
                "data" in response.body.singleResult
              ) {
                response.body.singleResult.extensions = {
                  ...response.body.singleResult.extensions,

                  openneuro: { version },
                }
              }
            },
          }
        },
      },
    ],
  })

  await apolloServer.start()

  // Setup GraphQL middleware
  app.use(
    ["/graphql", "/crn/graphql", "/api/graphql"],
    cors<cors.CorsRequest>(),
    jwt.authenticate,
    auth.optional,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        if (req.isAuthenticated()) {
          return {
            user: req.user.id,
            isSuperUser: req.user.admin,
            userInfo: req.user,
          }
        }
      },
    }),
  )

  return app
}
