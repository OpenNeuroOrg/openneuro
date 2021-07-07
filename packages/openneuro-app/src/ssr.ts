import fs from 'fs'
import path from 'path'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import cookiesMiddleware from 'universal-cookie-express'

const development = process.env.NODE_ENV === 'development'

const selfDestroyingServiceWorker = `self.addEventListener('install', function(e) {
  self.skipWaiting()
})

self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll()
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    })
})`

globalThis.OpenNeuroConfig = {
  CRN_SERVER_URL: process.env.CRN_SERVER_URL,
  GRAPHQL_URI: process.env.GRAPHQL_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GLOBUS_CLIENT_ID: process.env.GLOBUS_CLIENT_ID,
  ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
  ORCID_URI: process.env.ORCID_URI,
  ORCID_REDIRECT_URI: process.env.ORCID_REDIRECT_URI,
  GOOGLE_TRACKING_IDS: process.env.GOOGLE_TRACKING_IDS,
  ENVIRONMENT: process.env.ENVIRONMENT,
  SUPPORT_URL: process.env.SUPPORT_URL,
  DATALAD_GITHUB_ORG: process.env.DATALAD_GITHUB_ORG,
  AWS_S3_PUBLIC_BUCKET: process.env.AWS_S3_PUBLIC_BUCKET,
}

const configScript = `window.OpenNeuroConfig = ${JSON.stringify(
  globalThis.OpenNeuroConfig,
)}`

async function createServer(): Promise<void> {
  const app = express()
  let vite
  if (development) {
    // Create vite server in middleware mode. This disables Vite's own HTML
    // serving logic and let the parent server take control.
    vite = await createViteServer({
      root: path.resolve(__dirname, '../src'),
      server: { middlewareMode: true, hmr: { port: 9992 } },
      resolve: {
        alias: [
          // Workaround UMD -> ESM issues in pluralize
          {
            find: 'pluralize',
            replacement: path.resolve(__dirname, '../pluralize-esm.js'),
          },
        ],
      },
      optimizeDeps: {
        include: ['react-multi-carousel'],
      },
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(
      '/assets',
      express.static(path.resolve(__dirname, '../src/dist/client/assets'), {
        maxAge: '1y',
      }),
    )
  }

  app.use(cookiesMiddleware())

  app.use('*', (req, res) => {
    async function ssrHandler(): Promise<void> {
      const url = req.originalUrl

      if (url === '/sw.js') {
        res
          .status(200)
          .set({
            'Content-Type': 'application/javascript',
            'Cache-Control': 'public, max-age=0',
          })
          .end(selfDestroyingServiceWorker)
        return
      } else if (url === '/config.js') {
        res
          .status(200)
          .set({
            'Content-Type': 'application/javascript',
            'Cache-Control': 'public, max-age=0',
          })
          .end(configScript)
        return
      }

      let interpolate = {
        head: '',
        react: '',
        apolloState: 'e30K',
      }

      try {
        // 1. Read index.html
        const index = development
          ? '../src/index.html'
          : '../src/dist/client/index.html'
        let template = fs.readFileSync(path.resolve(__dirname, index), 'utf-8')

        // Allow proxies to cache anonymous requests
        let cacheControl = 'public, max-age=86400'

        try {
          // 2. Apply vite HTML transforms. This injects the vite HMR client, and
          //    also applies HTML transforms from Vite plugins, e.g. global preambles
          //    from @vitejs/plugin-react-refresh
          if (development)
            template = await vite.transformIndexHtml(url, template)

          // 3. Load the server entry. vite.ssrLoadModule automatically transforms
          //    your ESM source code to be usable in Node.js! There is no bundling
          //    required, and provides efficient invalidation similar to HMR.
          const { render } = development
            ? await vite.ssrLoadModule('../src/server.jsx')
            : require('../src/dist/server/server.js')

          // 4. render the app HTML. This assumes entry-server.js's exported `render`
          //    function calls appropriate framework SSR APIs,
          //    e.g. ReactDOMServer.renderToString()
          interpolate = await render(url, req['universalCookies'])
        } catch (e) {
          // no-cache on errors
          cacheControl = 'no-cache'
          // If an error is caught, let vite fix the stacktrace so it maps back to
          // your actual source code.
          if (development) {
            vite.ssrFixStacktrace(e)
          }
          console.error(e.stack)
        }

        // 5. Inject the app-rendered HTML into the template.
        const html = template.replace(/\${([^}]*)}/g, (r, k): string => {
          const replace: string = interpolate[k]
          return replace
        })

        // 6. Send the rendered HTML back.
        res
          .status(200)
          .set({
            'Content-Type': 'text/html',
            'Cache-Control': cacheControl,
          })
          .end(html)
      } catch (e) {
        // If all else fails, show the stack
        if (development) {
          vite.ssrFixStacktrace(e)
        }
        console.error(e.stack)
        res.status(500).end(e.stack)
      }
    }
    void ssrHandler()
  })

  app.listen(80)
}

void createServer()
