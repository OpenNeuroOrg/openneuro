import React from 'react'
import Helmet from 'react-helmet'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import configurables from './front-page/front-page-config'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'
import getClient from 'openneuro-client'
import config from '../../config'
import { CookiesProvider } from 'react-cookie'

const App = () => {
  return (
    <CookiesProvider>
      <ApolloProvider client={getClient(`${config.url}/crn/graphql`)}>
        <div>
          <Helmet>
            <title>{configurables.pageTitle}</title>
            <meta name="description" content={configurables.pageDescription} />
          </Helmet>
          <Router>
            <Route component={analyticsWrapper(Index)} />
          </Router>
        </div>
      </ApolloProvider>
    </CookiesProvider>
  )
}

export default App
