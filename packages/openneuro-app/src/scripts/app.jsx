import React from 'react'
import Helmet from 'react-helmet'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { pageTitle, pageDescription } from './resources/strings.js'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'
import getClient from 'openneuro-client'
import getAuth from './utils/getAuth.js'
import config from '../../config'

const App = () => {
  return (
    <ApolloProvider client={getClient(`${config.url}/crn/graphql`, getAuth)}>
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
        <Router>
          <Route component={analyticsWrapper(Index)} />
        </Router>
      </div>
    </ApolloProvider>
  )
}

export default App
