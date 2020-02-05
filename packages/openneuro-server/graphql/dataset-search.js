import elasticClient from '../elasticsearch/elastic-client'

const elasticIndex = 'datasets'

/**
 * Search result cursor resolver
 * TODO this is a Relay pagination type and could use the interface
 * @param {any} obj
 * @param {object} args
 * @param {string} args.q Query argument for ElasticSearch
 * @param {string} args.after
 * @param {number} args.first
 */
export const datasetSearchConnection = async (obj, { q, after, first }) => {
  const { body } = await elasticClient.search({
    index: elasticIndex,
    from: after,
    size: first,
    q,
  })
  return {
    edges: body.hits.hits.map(hit => ({
      node: { ...hit._source, __typename: 'Dataset' },
    })),
    pageInfo: {
      count: body.hits.total.value,
      endCursor: '',
      hasNextPage: false,
      // Always null since only forward pagination is implemented
      startCursor: null,
      // Always false since only forward pagination is implemented
      hasPreviousPage: false,
    },
  }
}

export default {
  search: {
    type: 'DatasetConnection',
    resolve: datasetSearchConnection,
    args: {
      q: { type: 'String!' },
      after: { type: 'String' },
      first: { type: 'Int' },
    },
  },
}
