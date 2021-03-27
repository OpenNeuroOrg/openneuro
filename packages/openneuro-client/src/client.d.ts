export declare function createClient(uri: string, options: {
  getAuthorization?: () => string
  fetch?: typeof fetch
  clientVersion?: string
  links?: Array<ApolloLink>
  ssrMode?: boolean
  cache?: ApolloCache
}): ApolloClient<*>
