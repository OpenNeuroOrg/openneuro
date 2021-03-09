export declare function createClient(uri: string, options: {
  getAuthorization?: () => string
  fetch?: typeof fetch
  clientVersion?: string
  links?: Array<ApolloLink>
}): ApolloClient<*>
