/**
 * Server entrypoint (CJS) - see client.tsx for browser entrypoint
 */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './scripts/app'
import Index from './scripts/index'
import { StaticRouter } from 'react-router-dom'
import { getConfig } from './scripts/config'

export function render(url) {
  return ReactDOMServer.renderToString(
    <App config={getConfig()}>
      <StaticRouter location={url}>
        <Index />
      </StaticRouter>
    </App>,
  )
}
