import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node"
import config from "./config"
import { version } from "./lerna.json"
import { CacheType } from "./cache/types"

Sentry.init({
  dsn: config.sentry.DSN,
  environment: config.sentry.ENVIRONMENT,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.redisIntegration({
      cachePrefixes: Object.values(CacheType),
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  release: `openneuro-server@${version}`,
  beforeSendTransaction(event) {
    if (event.transaction === "/crn/") {
      // Don't measure the healthcheck endpoint
      return null
    }
    return event
  },
})
