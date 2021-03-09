import { renderToString } from 'react-dom/server'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
//import { App } from 'openneuro-app'
import schema from '../graphql/schema.js'

const ssrClient = new ApolloClient({
  ssrMode: true,
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
})

/**
 * Server side page rendering Express handler for non-API URLs
 * @param {*} req
 * @param {*} res
 */
export function ssrHandler(req, res) {
  //req.send(renderToString(App))
}
