import elasticClient from '../../elasticsearch/elastic-client'
import { dataset } from './dataset'
import Star from '../../models/stars'
import Subscription from '../../models/subscription'
import Permission from '../../models/permission'
import { states } from '../permissions.js'

const elasticIndex = 'datasets'

/**
 * Remove a dataset from the index, used when deleting datasets to clean up
 * unreachable index entries
 * @param {string} id Dataset accession number id
 * @returns {Promise}
 */
export const removeDatasetSearchDocument = id =>
  elasticClient.delete({ id, index: elasticIndex })

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
export const elasticRelayConnection = async (
  { body },
  childResolvers = { dataset },
  user = null,
  userInfo = null,
) => {
  const count = body.hits.total.value
  const lastMatch = body.hits.hits[body.hits.hits.length - 1]
  return {
    edges: body.hits.hits.map(hit => {
      const node = childResolvers.dataset(
        null,
        { id: hit._source.id },
        { user, userInfo },
      )
      return { node }
    }),
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

export const datasetSearch = {
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

const addClause = (query, type, clause) => {
  if (query.bool[type]) {
    query.bool[type] = [...query.bool[type], clause]
  } else {
    query.bool[type] = [clause]
  }
}

const parseQuery = async (query, datasetType, datasetStatus, userId) => {
  if (datasetType === 'Following') {
    const results = await Subscription.find({ userId })
    const followedDatasets = results.map(({ datasetId }) => datasetId)
    const termsClause = {
      terms: {
        id: followedDatasets,
      },
    }
    addClause(query, 'filter', termsClause)
  } else if (datasetType === 'My Bookmarks') {
    const results = await Star.find({ userId })
    const bookmarkedDatasets = results.map(({ datasetId }) => datasetId)
    const termsClause = {
      terms: {
        id: bookmarkedDatasets,
      },
    }
    addClause(query, 'filter', termsClause)
  } else if (datasetType === 'My Datasets') {
    const results = await Permission.find({ userId })
    const bookmarkedDatasets = results.map(({ datasetId }) => datasetId)
    const termsClause = {
      terms: {
        id: bookmarkedDatasets,
      },
    }
    addClause(query, 'filter', termsClause)

    if (datasetStatus === 'Public') {
      addClause(query, 'filter', {
        term: {
          public: {
            value: true,
          },
        },
      })
    } else if (datasetStatus === 'Shared with Me') {
      addClause(query, 'filter', {
        terms: {
          ['permissions.userPermissions.level']: ['ro', 'rw'],
        },
      })
    } else if (datasetStatus === 'Invalid') {
      addClause(query, 'filter', {
        term: {
          ['draft.issues.severity']: 'error',
        },
      })
    }
  }
  return query
}

/**
 * Search result cursor resolver
 * TODO this is a Relay pagination type and could use the interface
 * @param {any} obj
 * @param {object} args
 * @param {object} args.query Stringified Query (DSL) argument for ElasticSearch
 * @param {string} args.datasetType Stringified Query (DSL) argument for ElasticSearch
 * @param {string} args.datasetStatus Stringified Query (DSL) argument for ElasticSearch
 * @param {object} args.sortBy Stringified Query (DSL) argument for ElasticSearch
 * @param {string} args.after Cursor for paging forward
 * @param {number} args.first Limit of entries to find
 */
export const advancedDatasetSearchConnection = async (
  obj,
  { query, datasetType, datasetStatus, sortBy, after, first = 25 },
  { user, userInfo },
) => {
  const sort = [{ _score: 'asc' }]
  if (sortBy) sort.unshift(sortBy)
  const requestBody = {
    sort,
    query: await parseQuery(query, datasetType, datasetStatus, user),
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
    body: requestBody,
  })
  return elasticRelayConnection(result, undefined, user, userInfo)
}

export const advancedDatasetSearch = {
  advancedSearch: {
    type: 'DatasetConnection',
    resolve: advancedDatasetSearchConnection,
    args: {
      query: { type: 'JSON!' },
      datasetType: { type: 'String' },
      datasetStatus: { type: 'String' },
      sortBy: { type: 'JSON' },
      after: { type: 'String' },
      first: { type: 'Int' },
    },
  },
}
