import 'cross-fetch/polyfill'
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  split,
  Observable,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import semver from 'semver'
import * as files from './files'
import * as datasets from './datasets'
import * as snapshots from './snapshots'
import * as users from './users'
import * as uploads from './uploads'
import datasetGenerator from './datasetGenerator.js'

const cache = new InMemoryCache()

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

export const middlewareAuthLink = (uri, getAuthorization, fetch) => {
  // We have to setup authLink to inject credentials here
  const httpLink = createHttpLink({
    uri,
    fetch: fetch === null ? undefined : fetch,
    credentials: 'same-origin',
  })
  if (getAuthorization) {
    return authLink(getAuthorization).concat(httpLink)
  } else {
    return httpLink
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

/**
 * Setup a client for working with the OpenNeuro API
 */
const createClient = (
  uri,
  {
    getAuthorization = undefined,
    fetch = undefined,
    clientVersion = undefined,
    links = [],
  } = {},
) => {
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore: This actually works but seems to be a typing error somewhere in Apollo
  return new ApolloClient(apolloClientOptions)
}

export {
  files,
  datasets,
  snapshots,
  users,
  datasetGenerator,
  createClient,
  uploads,
}
