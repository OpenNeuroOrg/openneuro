// Helpers for pagination

/**
 * Takes an API sort request and converts it to MongoDB
 * @param {object} sortOptions {created: 'ascending'}
 * @returns {object} Mongo suitable sort arguments {created: 1}
 */
export const enumToMongoSort = sortOptions =>
  Object.keys(sortOptions).reduce((mongoSort, val) => {
    mongoSort[val] = sortOptions[val] === 'ascending' ? 1 : -1
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
export const applyCursorToEdges = (edges, offset) => {
  return edges.map((edge, n) => ({
    cursor: apiCursor({ offset: offset + n }),
    node: edge,
  }))
}

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
 * @param {function} query Function returning MongoDB query to apply pagination to
 * @param {object} options Query options such as {limit: 5, orderBy: {creation: 'descending'}}
 */
export const datasetsConnection = (query, options) => {
  const offset = getOffsetFromCursor(options)
  const realLimit = maxLimit(options.first)
  return query()
    .countDocuments()
    .then(count =>
      pagingBound(sortQuery(query(), options), options).then(datasets => ({
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
      })),
    )
}

/**
 * Apply any needed sorts to a query
 * @param {object} query Mongoose query object
 * @param {object} options Query parameters
 */
export const sortQuery = (query, options) => {
  let sort = {}
  if (options.hasOwnProperty('orderBy')) {
    if ('created' in options.orderBy && options.orderBy.created) {
      sort['_id'] = options.orderBy.created === 'ascending' ? 1 : -1
    }
    if ('uploader' in options.orderBy && options.orderBy.uploader) {
      query.populate('uploader')
      sort['uploader.name'] = options.orderBy.uploader === 'ascending' ? 1 : -1
    }
    query.sort(sort)
  }
  return query
}

// Apply range bounds based on after/before arguments to query
export const pagingBound = (query, options) => {
  const offset = Math.max(getOffsetFromCursor(options), 0)
  return query.skip(offset).limit(maxLimit(options.first))
}
