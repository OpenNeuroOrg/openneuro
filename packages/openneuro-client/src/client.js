import 'cross-fetch/polyfill'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import FormData from 'form-data'
import * as files from './files'
import * as datasets from './datasets'
import * as snapshots from './snapshots'
import * as users from './users'

const cache = new InMemoryCache({
  freezeResults: true,
})

/**
 * Setup a client for working with the OpenNeuro API
 *
 * @param {string} uri
 */
const createClient = (uri, getAuthorization, fetch) => {
  const link = createLink(uri, getAuthorization, fetch)
  return new ApolloClient({ uri, link, cache, connectToDevTools: true })
}

const authLink = getAuthorization =>
  setContext((_, { headers }) => {
    // Passthrough any headers but add in authorization if set
    const token = getAuthorization()
    let cookie = {}
    if (token) {
      const tokenString = `accessToken=${token}`
      cookie = {
        cookie: tokenString,
      }
    }
    return {
      headers: Object.assign(cookie, headers),
    }
  })

const wsLink = uri => {
  const root = uri.replace('http', 'ws').replace('/crn', '')
  const subscriptions = '-subscriptions'
  const link = root + subscriptions
  return new WebSocketLink({
    uri: link,
    options: {
      reconnect: true,
    },
  })
}

const middlewareAuthLink = (uri, getAuthorization, fetch) => {
  // We have to setup authLink to inject credentials here
  const httpUploadLink = createUploadLink({
    uri,
    fetch,
    serverFormData: FormData,
    credentials: 'same-origin',
  })
  if (getAuthorization) {
    return authLink(getAuthorization).concat(httpUploadLink)
  } else {
    return httpUploadLink
  }
}

const createLink = (uri, getAuthorization, fetch) => {
  // We have to setup authLink to inject credentials here

  // server-side link
  let link = middlewareAuthLink(uri, getAuthorization, fetch)
  let ws

  try {
    // browser-side link
    ws = process.browser ? wsLink(uri) : null
  } catch (e) {
    // Don't die when websocket setup fails
  }
  if (ws) {
    link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      ws,
      middlewareAuthLink(uri, getAuthorization, fetch),
    )
  }

  return link
}

export { files, datasets, snapshots, users }
export default createClient
