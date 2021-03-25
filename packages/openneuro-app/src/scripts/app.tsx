import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { ApolloProvider } from '@apollo/client'
import { frontPage } from './front-page/front-page-content'
import { createClient } from 'openneuro-client'
import { version } from '../lerna.json'
import { CookiesProvider } from 'react-cookie'
import { ToastContainer } from 'react-toastify'

const App = ({ config, children }) => {
  return (
    <CookiesProvider>
      <ApolloProvider
        client={createClient(`${config.url}/crn/graphql`, {
          clientVersion: version,
        })}>
        <>
          <Helmet>
            <title>{frontPage.pageTitle}</title>
            <meta name="description" content={frontPage.pageDescription} />
          </Helmet>
          {children}
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
