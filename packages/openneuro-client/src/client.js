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

export const middlewareAuthLink = (uri, getAuthorization) => {
  // We have to setup authLink to inject credentials here
  const httpLink = createHttpLink({
    uri,
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
            // @ts-expect-error extensions exists but is not properly typed
            if (result.extensions) {
              // @ts-expect-error extensions exists but is not properly typed
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

const createLink = (uri, getAuthorization, enableWebsocket) => {
  return split(
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
    enableWebsocket ? wsLink(uri) : middlewareAuthLink(uri, getAuthorization),
    middlewareAuthLink(uri, getAuthorization),
  )
}

/**
 * Setup a client for working with the OpenNeuro API
 */
export const createClient = (
  uri,
  {
    getAuthorization = undefined,
    clientVersion = undefined,
    links = [],
    ssrMode = false,
    cache = undefined,
    enableWebsocket = false,
  } = {},
) => {
  // createLink must be last since it contains a terminating link
  const composedLink = ApolloLink.from([
    compareVersionsLink(clientVersion),
    ...links,
    createLink(uri, getAuthorization, enableWebsocket),
  ])

  const apolloClientOptions = {
    uri,
    link: composedLink,
    cache: cache || new InMemoryCache(),
    connectToDevTools: true,
    ssrMode,
    ssrForceFetchDelay: 1000,
  }

  // TODO: Figure this out?
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: This actually works but seems to be a typing error somewhere in Apollo
  return new ApolloClient(apolloClientOptions)
}
