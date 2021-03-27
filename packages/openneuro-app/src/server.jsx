/**
 * Server entrypoint (CJS) - see client.tsx for browser entrypoint
 */
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import { ApolloProvider } from '@apollo/client'
import { getDataFromTree } from '@apollo/client/react/ssr'
import { createClient } from 'openneuro-client'
import App from './scripts/app'
import Index from './scripts/index'
import { config } from './scripts/config'
import { mediaStyle } from './scripts/styles/media'
import { version } from './lerna.json'

export async function render(url, cookies) {
  // Client must be created on every call to avoid mixing credentials
  const client = createClient(`http://server:8111/crn/graphql`, {
    clientVersion: version,
    ssrMode: true,
    getAuthorization: () => cookies.get('accessToken'),
  })

  const react = await getDataFromTree(
    <App config={config} cookies={cookies}>
      <Helmet>
        <style type="text/css">{mediaStyle}</style>
      </Helmet>
      <ApolloProvider client={client}>
        <StaticRouter location={url}>
          <Index />
        </StaticRouter>
      </ApolloProvider>
    </App>,
  )

  // Required for Helmet to work in SSR mode
  const helmet = Helmet.renderStatic()
  const head = `${helmet.title.toString()}${helmet.meta.toString()}${helmet.style.toString()}`

  // Prevent <script> tags from strings
  const apolloState = Buffer.from(JSON.stringify(client.extract())).toString(
    'base64',
  )

  return { react, apolloState, head }
}
