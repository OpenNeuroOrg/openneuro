import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import semver from "semver"

let versionsWarned = false

const authLink = (getAuthorization) =>
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

const hbar = "\n-----------------------------------------------------\n"
const parse = (version) => [semver.major(version), semver.minor(version)]
const checkVersions = (serverVersion, clientVersion) => {
  if ([serverVersion, clientVersion].every(semver.valid)) {
    const [serverMajor, serverMinor] = parse(serverVersion)
    const [clientMajor, clientMinor] = parse(clientVersion)
    if (serverMajor > clientMajor || serverMinor > clientMinor) {
      if (!versionsWarned) {
        // eslint-disable-next-line no-console
        console.warn(
          `${hbar}Your OpenNeuro client is out of date (v${clientVersion}). We strongly recommend you update to the latest version (v${serverVersion}) for an optimal experience.${hbar}`,
        )
        versionsWarned = true
      }
    } else if (
      serverMajor < clientMajor ||
      (serverMajor === clientMajor && serverMinor < clientMinor)
    ) {
      // panic, then
      if (!versionsWarned) {
        // eslint-disable-next-line no-console
        console.warn(
          `${hbar}Your OpenNeuro client is out of date. We strongly recommend you update to the most recent version for an optimal experience.${hbar}`,
        )
        versionsWarned = true
      }
    }
  }
}

export const middlewareAuthLink = (uri, getAuthorization, fetch) => {
  // We have to setup authLink to inject credentials here
  const httpLink = createHttpLink({
    uri,
    fetch: fetch === null ? undefined : fetch,
    credentials: "same-origin",
  })
  if (getAuthorization) {
    return authLink(getAuthorization).concat(httpLink)
  } else {
    return httpLink
  }
}

const compareVersionsLink = (clientVersion) =>
  new ApolloLink(
    (operation, forward) =>
      new Observable((observer) =>
        forward(operation).subscribe({
          next: (result) => {
            if (result.extensions) {
              const serverVersion = result.extensions.openneuro.version
              // alert user if major/minor versions are not in sync
              checkVersions(serverVersion, clientVersion)
            }
            observer.next(result)
          },
          error: console.error,
          complete: observer.complete.bind(observer),
        })
      ),
  )

/**
 * Setup a client for working with the OpenNeuro API
 */
export const createClient = (
  uri,
  {
    getAuthorization = undefined,
    fetch = undefined,
    clientVersion = undefined,
    links = [],
    ssrMode = false,
    cache = undefined,
  } = {},
) => {
  // middlewareAuthLink must be last since it contains a terminating link
  const composedLink = ApolloLink.from([
    compareVersionsLink(clientVersion),
    ...links,
    middlewareAuthLink(uri, getAuthorization, fetch),
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
