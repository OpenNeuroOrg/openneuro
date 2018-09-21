import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { addMockFunctionsToSchema } from 'graphql-tools'
import schema from 'openneuro-server/graphql/schema'

/**
 * Generate sequential dataset ids for tests
 * @param {number} n Starting string value
 */
function* idGenerator(n = 0) {
  while (true) {
    const idStr = String(++n).padStart(6, '0')
    yield `ds${idStr}`
  }
}

export const datasetIds = idGenerator()
export const testDsId = datasetIds.next().value
export const testTime = new Date()

addMockFunctionsToSchema({
  schema,
  mocks: {
    Dataset: (root, { id }) => ({
      id: () => (id ? id : datasetIds.next().value),
      created: testTime,
      modified: testTime,
    }),
    DateTime: () => {
      return testTime
    },
    BigInt: () => {
      return 8589934592
    },
  },
})

const createClient = uri => {
  const cache = new InMemoryCache()
  const link = new SchemaLink({ schema })
  return new ApolloClient({ uri, link, cache })
}

export default createClient
