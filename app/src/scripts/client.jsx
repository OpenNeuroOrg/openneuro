// dependencies ---------------------------------------------------------
import 'url-search-params-polyfill'
import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import config from '../../config.js'
import App from './app.jsx'

const ravenConfig = {
  release: __GIT_HASH__,
  tags: { branch: __GIT_BRANCH__ },
  environment: config.sentry.environment,
  autoBreadcrumbs: {
    console: false,
  },
}

// Uses the public DSN here - private should not be used in the client app
Raven.config(
  'https://ba0c58863b3e40a2a412132bfd2711ea@sentry.io/251076',
  ravenConfig,
).install()

ReactDOM.render(<App />, document.getElementById('main'))
