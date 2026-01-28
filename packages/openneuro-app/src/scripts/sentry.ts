import * as Sentry from "@sentry/react"
import { config } from "./config"
import { version } from "../lerna.json"

Sentry.init({
  dsn:
    "https://988df6d6043a386440f614f1e936f73e@o4507748938350592.ingest.us.sentry.io/4507748943724544",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [config.url],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: config.sentry.environment,
  release: `openneuro-app@${version}`,
})
