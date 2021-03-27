import fs from 'fs'
import path from 'path'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import cookiesMiddleware from 'universal-cookie-express'

async function createServer(): Promise<void> {
  const app = express()

  // Create vite server in middleware mode. This disables Vite's own HTML
  // serving logic and let the parent server take control.
  const vite = await createViteServer({
    root: __dirname,
    server: { middlewareMode: true, hmr: { port: 9992 } },
  })
  // use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use(cookiesMiddleware())

  app.use('*', async (req, res) => {
    const url = req.originalUrl

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )

      // 2. Apply vite HTML transforms. This injects the vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react-refresh
      template = await vite.transformIndexHtml(url, template)

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await vite.ssrLoadModule('/server.jsx')

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const { react, apolloState, head } = await render(
        url,
        req['universalCookies'],
      )

      // 5. Inject the app-rendered HTML into the template.
      const interpolate = {
        head,
        react,
        apolloState,
      }
      const html = template.replace(/\${([^}]*)}/g, (r, k) => interpolate[k])

      // 6. Send the rendered HTML back.
      res
        .status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(html)
    } catch (e) {
      // If an error is caught, let vite fix the stracktrace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(9876)
}

createServer()
