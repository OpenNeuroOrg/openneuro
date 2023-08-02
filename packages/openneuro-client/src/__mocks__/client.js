import { ApolloClient, InMemoryCache } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from '@openneuro/server/src/graphql/schema'
import resolvers from '@openneuro/server/src/graphql/resolvers/index.js'

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
  typeDefs,
  resolvers,
})

addMocksToSchema({
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
    context: {
      user: '1234',
      userInfo: {
        id: '1234',
      },
    },
  })
  // @ts-expect-error
  return new ApolloClient({ uri, link, cache })
}
