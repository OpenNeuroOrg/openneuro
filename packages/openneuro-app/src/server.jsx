/**
 * Server entrypoint (CJS) - see client.tsx for browser entrypoint
 */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import { ApolloProvider } from '@apollo/client'
import { createClient } from 'openneuro-client'
import App from './scripts/app'
import Index from './scripts/index'
import { config } from './scripts/config'
import { mediaStyle } from './scripts/styles/media'
import { version } from './lerna.json'

export function render(url, cookies) {
  return ReactDOMServer.renderToString(
    <App config={config} cookies={cookies}>
      <ApolloProvider
        client={createClient(`${config.url}/crn/graphql`, {
          clientVersion: version,
          ssrMode: true,
          getAuthorization: () => cookies.get('accessToken'),
        })}>
        <Helmet>
          <style type="text/css">{mediaStyle}</style>
        </Helmet>
        <StaticRouter location={url}>
          <Index />
        </StaticRouter>
      </ApolloProvider>
    </App>,
  )
}
