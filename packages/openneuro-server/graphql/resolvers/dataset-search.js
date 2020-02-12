import elasticClient from '../../elasticsearch/elastic-client'
import { dataset } from './dataset'

const elasticIndex = 'datasets'

/**
 * Accepts an array of fields representing the sort order for the search
 * @param {Array<*>} sort
 * @returns {string}
 */
export const encodeCursor = sort =>
  Buffer.from(JSON.stringify(sort)).toString('base64')

/**
 * Accepts a cursor and returns the deserialized elastic search search_after array
 * @param {string} cursor
 * @returns {Array<*>}
 */
export const decodeCursor = cursor =>
  JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'))

/**
 * Return a relay cursor from an elastic search result
 * @param {import ('@elastic/elasticsearch').ApiResponse} result
 */
export const elasticRelayConnection = (
  { body },
  childResolvers = { dataset },
) => {
  const count = body.hits.total.value
  const lastMatch = body.hits.hits[body.hits.hits.length - 1]
  return {
    edges: body.hits.hits.map(hit => ({
      node: childResolvers.dataset(
        null,
        { id: hit._source.id },
        { user: null, userInfo: null }, // All searches are anonymous
      ),
    })),
    pageInfo: {
      count,
      endCursor: lastMatch
        ? encodeCursor([lastMatch._score, lastMatch._id])
        : null,
      hasNextPage: Boolean(lastMatch),
      // Always null since only forward pagination is implemented
      startCursor: null,
      // Always false since only forward pagination is implemented
      hasPreviousPage: false,
    },
  }
}

/**
 * Search result cursor resolver
 * TODO this is a Relay pagination type and could use the interface
 * @param {any} obj
 * @param {object} args
 * @param {string} args.q Query argument for ElasticSearch
 * @param {string} args.after Cursor for paging forward
 * @param {number} args.first Limit of entries to find
 */
export const datasetSearchConnection = async (
  obj,
  { q, after, first = 25 },
) => {
  const requestBody = {
    sort: [{ _score: 'asc', id: 'desc' }],
  }
  if (after) {
    try {
      requestBody.search_after = decodeCursor(after)
    } catch (err) {
      // Don't include search_after if parsing fails
    }
  }
  const result = await elasticClient.search({
    index: elasticIndex,
    size: first,
    q,
    body: requestBody,
  })
  return elasticRelayConnection(result)
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
