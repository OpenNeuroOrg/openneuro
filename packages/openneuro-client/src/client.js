import 'cross-fetch/polyfill'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloLink, split, Observable } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import semver from 'semver'
import * as FormData from 'form-data'
import * as files from './files'
import * as datasets from './datasets'
import * as snapshots from './snapshots'
import * as users from './users'
import datasetGenerator from './datasetGenerator.js'
import { version } from '../package.json'

const cache = new InMemoryCache({
  freezeResults: true,
})

/**
 * Setup a client for working with the OpenNeuro API
 *
 * @param {string} uri GraphQL API URI (passed to Apollo Client)
 * @param {object} options Optional extra configuration
 * @param {function} [options.getAuthorization] Synchronous authorization cookie factory
 * @param {function} [options.fetch] Fetch implementation
 * @param {string} [options.clientVersion] Client version to check automatically on requests
 * @param {Array<ApolloLink>} [options.links] Any extra links to compose
 */
const createClient = (uri, options = {}) => {
  const {
    getAuthorization = null,
    fetch = null,
    clientVersion = version,
    links = [],
  } = options
  // createLink must be last since it contains a terminating link
  const composedLink = ApolloLink.from([
    compareVersionsLink(clientVersion),
    ...links,
    createLink(uri, getAuthorization, fetch),
  ])

  const apolloClientOptions = {
    uri,
    link: composedLink,
    cache,
    connectToDevTools: true,
  }

  // TODO: Figure this out?
  // @ts-ignore: This actually works but seems to be a typing error somewhere in Apollo
  return new ApolloClient(apolloClientOptions)
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

const hbar = '\n-----------------------------------------------------\n'
const parse = version => [semver.major(version), semver.minor(version)]
const checkVersions = (serverVersion, clientVersion) => {
  if ([serverVersion, clientVersion].every(semver.valid)) {
    const [serverMajor, serverMinor] = parse(serverVersion)
    const [clientMajor, clientMinor] = parse(clientVersion)
    if (serverMajor > clientMajor || serverMinor > clientMinor) {
      console.warn(
        `${hbar}Your OpenNeuro client is out of date (v${clientVersion}). We strongly recommend you update to the latest version (v${serverVersion}) for an optimal experience.${hbar}`,
      )
    } else if (
      serverMajor < clientMajor ||
      (serverMajor === clientMajor && serverMinor < clientMinor)
    ) {
      // panic, then
      console.warn(
        `${hbar}Your OpenNeuro client is out of date. We strongly recommend you update to the most recent version for an optimal experience.${hbar}`,
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
            if (result.extensions) {
              const serverVersion = result.extensions.openneuro.version
              // alert user if major/minor versions are not in sync
              checkVersions(serverVersion, clientVersion)
            }
            observer.next(result)
          },
          error: console.error,
          complete: observer.complete.bind(observer),
        }),
      ),
  )

const createLink = (uri, getAuthorization, fetch) => {
  // We have to setup authLink to inject credentials here

  // server-side link
  let link = middlewareAuthLink(uri, getAuthorization, fetch)
  let ws

  try {
    // browser-side link
    ws = typeof window !== 'undefined' ? wsLink(uri) : null
  } catch (e) {
    // Don't die when websocket setup fails
  }
  if (ws) {
    link = split(
      ({ query }) => {
        /**
         * Typescript complains because this can return
         * FragmentDefinitionNode or OperationDefinitionNode
         * so we cannot use a simple destructuring
         * `const { kind, operation }`
         **/
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      ws,
      middlewareAuthLink(uri, getAuthorization, fetch),
    )
  }

  return link
}

export { files, datasets, snapshots, users, datasetGenerator }
export default createClient
