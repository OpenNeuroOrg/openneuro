import 'cross-fetch/polyfill'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloLink, split, Observable } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import FormData from 'form-data'
import semver from 'semver'
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
const createClient = (uri, getAuthorization, fetch, clientVersion) => {
  const link = createLink(uri, getAuthorization, fetch, clientVersion)
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
    fetch: fetch === null ? undefined : fetch,
    serverFormData: FormData,
    credentials: 'same-origin',
  })
  if (getAuthorization) {
    return authLink(getAuthorization).concat(httpUploadLink)
  } else {
    return httpUploadLink
  }
}

const parse = version => [semver.major(version), semver.minor(version)]
const checkVersions = (serverVersion, clientVersion) => {
  if ([serverVersion, clientVersion].every(semver.valid)) {
    const [serverMajor, serverMinor] = parse(serverVersion)
    const [clientMajor, clientMinor] = parse(clientVersion)
    if (serverMajor > clientMajor || serverMinor > clientMinor) {
      console.warn(
        `Your openNeuro client is out of date (v${clientVersion}). We strongly recommend you update to the latest version (v${serverVersion}) for an optimal experience.`,
      )
    } else if (
      serverMajor < clientMajor ||
      (serverMajor === clientMajor && serverMinor < clientMinor)
    ) {
      // panic, then
      console.warn(
        'Your openNeuro client is out of date. We strongly recommend you update to the most recent version for an optimal experience.',
      )
    }
  }
}

const compareVersionsLink = clientVersion =>
  new ApolloLink(
    (operation, forward) =>
      new Observable(observer =>
        forward(operation).subscribe({
          next: result => {
            const serverVersion = result.extensions.openneuro.version
            // alert user if major/minor versions are not in sync
            checkVersions(serverVersion, clientVersion)
            observer.next(result)
          },
          error: console.error,
          complete: observer.complete.bind(observer),
        }),
      ),
  )

const createLink = (uri, getAuthorization, fetch, clientVersion) => {
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

  return ApolloLink.from([compareVersionsLink(clientVersion), link])
}

export { files, datasets, snapshots, users }
export default createClient
