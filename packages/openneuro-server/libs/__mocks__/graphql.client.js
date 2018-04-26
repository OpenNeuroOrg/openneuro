/**
 * For tests, this presents a mock version of the server API
 */
import ApolloClient from 'apollo-client-preset'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
//import { addMockFunctionsToSchema } from 'graphql-tools'
import schema from '../../graphql/schema'

// Explicit mock data will go here as needed...
//const mockedSchema = addMockFunctionsToSchema({ schema, mocks })

export default new ApolloClient({
  link: new SchemaLink({ schema: schema }),
  cache: new InMemoryCache(),
})
