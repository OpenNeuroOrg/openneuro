import { init as initApm } from '@elastic/apm-rum'
import * as Sentry from '@sentry/browser'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'
import packageJson from '../../package.json'
import { loadConfig } from './config.js'
import * as GoogleAnalytics from 'react-ga'

if (module.hot) module.hot.accept()

loadConfig().then(config => {
  if (
    config.sentry.environment === 'production' ||
    config.sentry.environment === 'staging'
  ) {
    initApm({
      serverUrl: config.url,
      serviceName: 'openneuro-app',
      serviceVersion: packageJson.version,
      environment: config.sentry.environment,
    })
  }

  GoogleAnalytics.initialize(config.analytics.trackingId)

  Sentry.init({
    dsn: 'https://ba0c58863b3e40a2a412132bfd2711ea@sentry.io/251076',
    release: packageJson.version,
    environment: config.sentry.environment,
  })

  // Setup the service worker
  if ('serviceWorker' in navigator) {
    runtime.register()
  } else {
    Sentry.captureMessage('Service worker registration failed.')
  }

  ReactDOM.render(<App config={config} />, document.getElementById('main'))
})
