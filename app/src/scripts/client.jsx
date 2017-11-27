// dependencies ---------------------------------------------------------
import 'url-search-params-polyfill'
import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'

const ravenConfig = {
  release: __GIT_HASH__,
  tags: { branch: __GIT_BRANCH__ },
  environment: process.env.AWS_BATCH_QUEUE,
}

Raven.config(
  'https://ba0c58863b3e40a2a412132bfd2711ea@sentry.io/251076',
  ravenConfig,
).install()

ReactDOM.render(
  <Router>
    <Route component={analyticsWrapper(Index)} />
  </Router>,
  document.getElementById('main'),
)
