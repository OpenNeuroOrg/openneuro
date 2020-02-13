import { getDatasets } from './datasets.js'

/**
 * Iterator over all public datasets associated with a client connection
 * @param {import('apollo-client').ApolloClient} client
 * @param {*} query
 */
export default async function* datasetGenerator(client, query = getDatasets) {
  let cursor
  while (true) {
    try {
      const { data } = await client.query({
        query,
        variables: { filterBy: { public: true }, cursor },
        errorPolicy: 'ignore',
      })
      for (let i = 0; i < data.datasets.edges.length; i++) {
        // Yield one dataset result
        yield data.datasets.edges[i].node
      }
      if (data.datasets.pageInfo.hasNextPage) {
        // Next query with new cursor
        cursor = data.datasets.pageInfo.endCursor
      } else {
        // Exit if done
        return null
      }
    } catch (e) {
      console.error(e)
    }
  }
}
