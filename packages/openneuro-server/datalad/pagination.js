// Helpers for pagination
import Dataset from '../models/dataset.js'

const sortEnumToInt = val => (val === 'ascending' ? 1 : -1)

/**
 * Takes an API sort request and converts it to MongoDB
 * @param {object} sortOptions {created: 'ascending'}
 * @returns {object} Mongo suitable sort arguments {created: 1}
 */
export const enumToMongoSort = sortOptions =>
  Object.keys(sortOptions).reduce((mongoSort, val) => {
    mongoSort[val] = sortEnumToInt(sortOptions[val])
    return mongoSort
  }, {})

/**
 * Encode a cursor offset in a mongodb collection
 * @param {object} value cursor fields
 */
export const apiCursor = value => {
  return Buffer.from(JSON.stringify(value)).toString('base64')
}

export const decodeCursor = cursor => {
  return JSON.parse(Buffer.from(cursor, 'base64').toString())
}

/**
 * Adds cursors to each edge node from a Mongoose result
 * @param {array[object]} edges
 * @param {number} offset The leading edge of the pagination window as an offset
 */
export const applyCursorToEdges = (edges, offset) =>
  edges.map((edge, n) => ({
    cursor: apiCursor({ offset: offset + n }),
    node: edge,
  }))

// Decode cursor from options object
export const getOffsetFromCursor = options => {
  if (options.hasOwnProperty('after') && options.after) {
    return decodeCursor(options.after).offset
  }
  if (options.hasOwnProperty('before') && options.before) {
    return (
      decodeCursor(options.before).offset - Math.max(maxLimit(options.first), 0)
    )
  }
  // Default to zero if no cursor
  return 0
}

// Limit to options.first in range 1 <= limit <= 100
export const maxLimit = limit => Math.max(Math.min(limit, 100), 1)

/**
 * Dataset pagination wrapper
 * @param {array} presortAggregate Any presorting / pagination constraints
 * @param {object} options Query options such as {limit: 5, orderBy: {creation: 'descending'}}
 */
export const datasetsConnection = (presortAggregate, options) => {
  const offset = getOffsetFromCursor(options)
  const realLimit = maxLimit(options.first)
  // One query for match -> sort ->
  return Dataset.aggregate([
    ...presortAggregate,
    ...sortAggregate(options),
    {
      $group: { _id: null, count: { $sum: 1 }, datasets: { $push: '$$ROOT' } },
    },
    {
      $project: {
        count: 1,
        datasets: { $slice: ['$datasets', offset, realLimit] },
      },
    },
  ])
    .exec()
    .then(results => {
      const { datasets, count } = results.pop()
      return {
        edges: applyCursorToEdges(datasets, offset),
        pageInfo: {
          // True if there are no results before this
          hasPreviousPage: offset > 0,
          // First ordered object id in the limited set
          startCursor: apiCursor({ offset }),
          // True if there are no results after this
          hasNextPage: offset + realLimit < count,
          // Last ordered object id in the limited set
          endCursor: apiCursor({ offset: offset + realLimit }),
          // Count of all documents in this query
          count,
        },
      }
    })
}

/**
 * Apply any needed sorts to an aggregation pipeline
 * @param {object} options Query parameters
 * @returns {array} Steps required to sort any specified fields
 */
export const sortAggregate = options => {
  const sortingStages = []
  const finalSort = {}
  if (options.hasOwnProperty('orderBy')) {
    if ('created' in options.orderBy && options.orderBy.created) {
      finalSort['_id'] = sortEnumToInt(options.orderBy.created)
    }
    if ('uploader' in options.orderBy && options.orderBy.uploader) {
      sortingStages.push({
        $lookup: {
          from: 'users',
          localField: 'uploader',
          foreignField: 'id',
          as: 'uploadUser',
        },
      })
      finalSort['uploadUser.name'] = sortEnumToInt(options.orderBy.uploader)
    }
    if ('stars' in options.orderBy && options.orderBy.stars) {
      // Lookup related collection values
      sortingStages.push({
        $lookup: {
          from: 'stars',
          localField: 'id',
          foreignField: 'datasetId',
          as: 'stars',
        },
      })
      // Count stars
      sortingStages.push({
        $addFields: {
          starsCount: { $size: '$stars' },
        },
      })
      finalSort['starsCount'] = sortEnumToInt(options.orderBy.stars)
    }
    if ('downloads' in options.orderBy && options.orderBy.downloads) {
      sortingStages.push({
        $lookup: {
          from: 'analytics',
          localField: 'id',
          foreignField: 'datasetId',
          as: 'analytics',
        },
      })
      finalSort['analytics.downloads'] = sortEnumToInt(
        options.orderBy.downloads,
      )
    }
    if ('subscriptions' in options.orderBy && options.orderBy.subscriptions) {
      sortingStages.push({
        $lookup: {
          from: 'subscriptions',
          localField: 'id',
          foreignField: 'datasetId',
          as: 'subscriptions',
        },
      })
      // Count stars
      sortingStages.push({
        $addFields: {
          subscriptionsCount: { $size: '$subscriptions' },
        },
      })
      finalSort['subscriptionsCount'] = sortEnumToInt(
        options.orderBy.subscriptions,
      )
    }
    sortingStages.push({ $sort: finalSort })
  }
  return sortingStages
}

// Apply range bounds based on after/before arguments to query
export const pagingBound = (query, options) => {
  const offset = Math.max(getOffsetFromCursor(options), 0)
  return query.skip(offset).limit(maxLimit(options.first))
}
