import * as Sentry from "@sentry/node"
import { elasticClient } from "../../elasticsearch/elastic-client"
import { dataset } from "./dataset"
import Star from "../../models/stars"
import Subscription from "../../models/subscription"
import Permission from "../../models/permission"
import { hashObject } from "../../libs/authentication/crypto"

const elasticIndex = "datasets"

/**
 * Remove a dataset from the index, used when deleting datasets to clean up
 * unreachable index entries
 * @param {string} id Dataset accession number id
 * @returns {Promise}
 */
export const removeDatasetSearchDocument = (id) =>
  elasticClient.delete({ id, index: elasticIndex })

/**
 * Accepts an array of fields representing the sort order for the search
 * @param {Array<*>} sort
 * @returns {string}
 */
export const encodeCursor = (sort) =>
  Buffer.from(JSON.stringify(sort)).toString("base64")

/**
 * Accepts a cursor and returns the deserialized elastic search search_after array
 * @param {string} cursor
 * @returns {Array<*>}
 */
export const decodeCursor = (cursor) =>
  JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"))

/**
 * Return a relay cursor from an elastic search result
 * @param {import ('@elastic/elasticsearch').ApiResponse} result
 */
export const elasticRelayConnection = (
  body,
  id,
  size,
  childResolvers = { dataset },
  user = null,
  userInfo = null,
) => {
  try {
    const count = body.hits.total.value
    const lastMatch = body.hits.hits[body.hits.hits.length - 1]
    const hasNextPage = Boolean(body.hits.hits[size - 1])
    return {
      id,
      edges: body.hits.hits.map((hit) => {
        const node = childResolvers.dataset(
          null,
          { id: hit._source.id },
          { user, userInfo },
        )
        return { id: hit._source.id, node }
      }),
      pageInfo: {
        count,
        endCursor: lastMatch ? encodeCursor(lastMatch.sort) : null,
        hasNextPage,
        // Always null since only forward pagination is implemented
        startCursor: null,
        // Always false since only forward pagination is implemented
        hasPreviousPage: false,
      },
    }
  } catch (err) {
    Sentry.captureException(err)
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
  const searchId = hashObject({ q })
  const requestBody = {
    sort: [{ _score: "asc", id: "desc" }],
    search_after: undefined,
  }
  if (after) {
    try {
      requestBody.search_after = decodeCursor(after)
    } catch (_err) {
      // Don't include search_after if parsing fails
    }
  }
  await elasticClient.search({
    index: elasticIndex,
    size: first,
    q: `${q} AND public:true`,
    ...requestBody,
  })
  return elasticRelayConnection(requestBody, searchId, first)
}

export const datasetSearch = {
  search: {
    type: "DatasetConnection",
    resolve: datasetSearchConnection,
    args: {
      q: { type: "String!" },
      after: { type: "String" },
      first: { type: "Int" },
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
  if (datasetType === "All Public") {
    addClause(query, "filter", {
      term: {
        public: {
          value: true,
        },
      },
    })
  } else if (datasetType === "Following") {
    const results = await Subscription.find({ userId })
    const followedDatasets = results.map(({ datasetId }) => datasetId)
    const termsClause = {
      terms: {
        id: followedDatasets,
      },
    }
    addClause(query, "filter", termsClause)
  } else if (datasetType === "My Bookmarks") {
    const results = await Star.find({ userId })
    const bookmarkedDatasets = results.map(({ datasetId }) => datasetId)
    const termsClause = {
      terms: {
        id: bookmarkedDatasets,
      },
    }
    addClause(query, "filter", termsClause)
  } else if (datasetType === "My Datasets") {
    const results = await Permission.find({ userId })
    const bookmarkedDatasets = results.map(({ datasetId }) => datasetId)
    const termsClause = {
      terms: {
        id: bookmarkedDatasets,
      },
    }
    addClause(query, "filter", termsClause)
    // Add logic to explicitly check for the "All" status
    if (datasetStatus && datasetStatus !== "All") {
      if (datasetStatus === "Public") {
        addClause(query, "filter", {
          term: {
            public: {
              value: true,
            },
          },
        })
      } else if (datasetStatus === "Shared with Me") {
        addClause(query, "filter", {
          terms: {
            ["permissions.userPermissions.level"]: ["ro", "rw"],
          },
        })
      } else if (datasetStatus === "Invalid") {
        addClause(query, "filter", {
          range: {
            "latestSnapshot.validation.errors": {
              gt: 0,
            },
          },
        })
      }
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
 * @param {boolean} args.allDatasets Admin option for returning all datasets (overrides datasetType and datasetStatus, but keeps other search parameters) (default = false)
 * @param {string} args.datasetType Stringified Query (DSL) argument for ElasticSearch
 * @param {string} args.datasetStatus Stringified Query (DSL) argument for ElasticSearch
 * @param {object} args.sortBy Stringified Query (DSL) argument for ElasticSearch
 * @param {string} args.after Cursor for paging forward
 * @param {number} args.first Limit of entries to find
 */
export const advancedDatasetSearchConnection = async (
  obj,
  {
    query,
    allDatasets = false,
    datasetType,
    datasetStatus,
    sortBy,
    after,
    first = 25,
  },
  { user, userInfo },
) => {
  // Create an identity for this search (used to cache connections)
  const searchId = hashObject({
    query,
    datasetType,
    datasetStatus,
    sortBy,
    user,
  })
  const sort = [{ _score: "desc" }, { id: "desc" }]
  if (sortBy) {
    sort.unshift(sortBy)
  }
  // Parse out the decode token and add it to our query if successful
  let search_after
  if (after) {
    try {
      search_after = decodeCursor(after)
    } catch (_err) {
      // Don't include search_after if parsing fails
    }
  }
  const requestBody = {
    index: elasticIndex,
    size: first,
    sort,
    query: allDatasets
      ? query
      : await parseQuery(query, datasetType, datasetStatus, user),
    search_after,
  }
  // Run the query
  const result = await elasticClient.search(requestBody)
  // Extend with relay connection pagination
  return elasticRelayConnection(
    result,
    searchId,
    first,
    undefined,
    user,
    userInfo,
  )
}

export const advancedDatasetSearch = {
  advancedSearch: {
    type: "DatasetConnection",
    resolve: advancedDatasetSearchConnection,
    args: {
      query: { type: "JSON!" },
      allDatasets: { type: "Boolean" },
      datasetType: { type: "String" },
      datasetStatus: { type: "String" },
      sortBy: { type: "JSON" },
      after: { type: "String" },
      first: { type: "Int" },
    },
  },
}
