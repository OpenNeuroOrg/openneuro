import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { frontPage } from 'openneuro-content'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'
import getClient from 'openneuro-client'
import packageJson from '../../package.json'
import { CookiesProvider } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
//
const App = ({ config }) => {
  return (
    <CookiesProvider>
      <ApolloProvider
        client={getClient(
          `${config.url}/crn/graphql`,
          null,
          null,
          packageJson.version,
        )}>
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
