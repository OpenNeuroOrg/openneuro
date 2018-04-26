/**
 * Setup a default GraphQL client
 */
import fetch from 'node-fetch'
import ApolloClient from 'apollo-client-preset'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// The URL here is hard coded to connect to the local server
export default new ApolloClient({
  link: new HttpLink({ uri: 'http://server/crn/graphql', fetch }),
  cache: new InMemoryCache(),
})
