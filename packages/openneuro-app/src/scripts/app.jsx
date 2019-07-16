import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { frontPage } from 'openneuro-content'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'
import getClient from 'openneuro-client'
import { CookiesProvider } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import { expiringBanner } from './utils/userNotify.js'

const App = ({ config }) => {
  expiringBanner(
    'OpenNeuro will be unavailable for approximately 1 hour for planned maintenance on Wednesday, July 24th at 19:00 UTC',
    new Date(1564124400 * 1000), // Friday, July 26th
  )
  return (
    <CookiesProvider>
      <ApolloProvider client={getClient(`${config.url}/crn/graphql`)}>
        <>
          <Helmet>
            <title>{frontPage.pageTitle}</title>
            <meta name="description" content={frontPage.pageDescription} />
          </Helmet>
          <Router>
            <Route component={analyticsWrapper(Index)} />
          </Router>
          <ToastContainer position="bottom-right" />
        </>
      </ApolloProvider>
    </CookiesProvider>
  )
}

App.propTypes = {
  config: PropTypes.object,
}

export default App
