import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools'
import { typeDefs } from 'openneuro-server/graphql/schema'
import resolvers from 'openneuro-server/graphql/resolvers/index.js'

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

// Workaround to restore this test, it should be refactored with openneuro-client updates
const schema = makeExecutableSchema({
  typeDefs: `
directive @cacheControl(
  maxAge: Int,
  scope: CacheControlScope
) on OBJECT | FIELD_DEFINITION

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

${typeDefs}`,
  resolvers,
})

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

export const createClient = uri => {
  const cache = new InMemoryCache()
  const link = new SchemaLink({
    schema,
  })
  return new ApolloClient({ uri, link, cache })
}
