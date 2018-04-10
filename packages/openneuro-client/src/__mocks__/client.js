import fetch from 'node-fetch'
import ApolloClient from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { addMockFunctionsToSchema } from 'graphql-tools'
import schema from 'openneuro-server/graphql/schema'

export const testDsId = 'ds000001'
export const testTime = new Date()

addMockFunctionsToSchema({
  schema,
  mocks: {
    Dataset: () => ({
      id: testDsId,
      label: 'Test Dataset',
      created: testTime,
      modified: testTime,
    }),
  },
})

const createClient = uri => {
  const cache = new InMemoryCache()
  const link = new SchemaLink({ schema })
  return new ApolloClient({ uri, link, cache })
}

export default createClient
