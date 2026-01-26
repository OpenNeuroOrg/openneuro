import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node"
import config from "./config"
import { version } from "./lerna.json"

Sentry.init({
  dsn: config.sentry.DSN,
  environment: config.sentry.ENVIRONMENT,
  integrations: [
    nodeProfilingIntegration(),
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
  ignoreErrors: [
    "You do not have access to read this dataset.",
    "You do not have access to modify this dataset.",
  ],
  sendDefaultPii: true,
})
