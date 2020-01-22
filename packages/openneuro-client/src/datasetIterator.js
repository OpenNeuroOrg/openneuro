import { getDatasets } from './datasets.js'

/**
 * Iterator over all public datasets associated with a client connection
 * @param {ApolloClient} client
 */
export default async function* datasetIterator(client) {
  let cursor
  while (true) {
    const result = await client.query({
      query: getDatasets,
      variables: { filterBy: { public: true }, cursor },
    })
    // Exit if done
    if (result.datasets.edges.length === 0) {
      break
    }
    for (let i = 0; i < result.datasets.edges.length; i++) {
      // Yield one dataset result
      yield result.datasets.edges[i].node
    }
    // Next query with new cursor
    cursor = result.datasets.pageInfo.endCursor
  }
}
