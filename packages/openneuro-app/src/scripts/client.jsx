// dependencies ---------------------------------------------------------
import 'url-search-params-polyfill'
import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import config from '../../config.js'
import App from './app.jsx'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'
import packageJson from '../../package.json'

const ravenConfig = {
  release: packageJson.version,
  environment: config.sentry.environment,
  autoBreadcrumbs: {
    console: false,
  },
}

// Setup the service worker
if ('serviceWorker' in navigator) {
  runtime.register()
} else {
  Raven.captureMessage('Service worker registration failed.')
}

// Uses the public DSN here - private should not be used in the client app
Raven.config(
  'https://ba0c58863b3e40a2a412132bfd2711ea@sentry.io/251076',
  ravenConfig,
).install()

ReactDOM.render(<App />, document.getElementById('main'))
