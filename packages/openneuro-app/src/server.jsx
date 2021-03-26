/**
 * Server entrypoint (CJS) - see client.tsx for browser entrypoint
 */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import App from './scripts/app'
import Index from './scripts/index'
import { getConfig } from './scripts/config'
import { mediaStyle } from './scripts/styles/media'

export function render(url) {
  return ReactDOMServer.renderToString(
    <App config={getConfig()}>
      <Helmet>
        <style type="text/css">{mediaStyle}</style>
      </Helmet>
      <StaticRouter location={url}>
        <Index />
      </StaticRouter>
    </App>,
  )
}
