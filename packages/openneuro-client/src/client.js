import 'cross-fetch/polyfill'
import ApolloClient from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import FormData from 'form-data'
import * as files from './files'
import * as datasets from './datasets'
import * as snapshots from './snapshots'

const cache = new InMemoryCache()

/**
 * Setup a client for working with the OpenNeuro API
 *
 * @param {string} uri
 */
const createClient = (uri, getAuthorization, fetch) => {
  const link = createLink(uri, getAuthorization, fetch)
  return new ApolloClient({ uri, link, cache })
}

const authLink = getAuthorization =>
  setContext((_, { headers }) => {
    // Passthrough any headers but add in authorization if set
    const token = getAuthorization ? getAuthorization() : false
    let tokenString = ''
    if (token) {
      if (
        typeof window !== 'undefined' &&
        global.localStorage &&
        global.localStorage.token
      ) {
        tokenString = `${token}`
      } else {
        tokenString = `Bearer ${token}`
      }
      return {
        headers: Object.assign(
          {
            authorization: tokenString,
          },
          headers,
        ),
      }
    } else {
      return headers
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
  })
  return authLink(getAuthorization).concat(httpUploadLink)
}

const createLink = (uri, getAuthorization, fetch) => {
  // We have to setup authLink to inject credentials here

  // server-side link
  let link = middlewareAuthLink(uri, getAuthorization, fetch)

  // browser-side link
  const ws = process.browser ? wsLink(uri) : null
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

export { files, datasets, snapshots }
export default createClient
