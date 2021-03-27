/**
 * Browser client entrypoint - see server.tsx for SSR entrypoint
 */
import './scripts/utils/global-polyfill'
import { setupApm } from './scripts/apm.js'
import * as Sentry from '@sentry/browser'
import { ApolloProvider, InMemoryCache } from '@apollo/client'
import { createClient } from 'openneuro-client'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './scripts/app'
import Index from './scripts/index'
import analyticsWrapper from './scripts/utils/analytics'
import { version } from './lerna.json'
import { config } from './scripts/config'
import * as GoogleAnalytics from 'react-ga'

if (
  config.sentry.environment === 'production' ||
  config.sentry.environment === 'staging'
) {
  setupApm({
    serverUrl: config.url,
    serviceName: 'openneuro-app',
    serviceVersion: version,
    environment: config.sentry.environment,
  })
} else {
  setupApm({
    serverUrl: config.url,
    serviceName: 'openneuro-app',
    serviceVersion: version,
    environment: config.sentry.environment,
    active: false,
  })
}

GoogleAnalytics.initialize(config.analytics.trackingId)

Sentry.init({
  dsn: 'https://ba0c58863b3e40a2a412132bfd2711ea@sentry.io/251076',
  release: version,
  environment: config.sentry.environment,
})

// Setup the service worker
if ('serviceWorker' in navigator) {
  //navigator.serviceWorker.register('/sw.js')
} else {
  Sentry.captureMessage('Service worker registration failed.')
}

ReactDOM.render(
  <App>
    <ApolloProvider
      client={createClient(`${config.url}/crn/graphql`, {
        clientVersion: version,
        // @ts-expect-error
        cache: new InMemoryCache().restore(JSON.parse(window.__APOLLO_STATE__)),
      })}>
      <BrowserRouter>
        <Route component={analyticsWrapper(Index)} />
      </BrowserRouter>
    </ApolloProvider>
  </App>,
  document.getElementById('main'),
)
