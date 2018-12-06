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
 * @param {string} id Object _id
 */
export const apiCursor = id => {
  return Buffer.from(id.toString()).toString('base64')
}

/**
 * Adds cursors to each edge node from a Mongoose result
 * @param {array[object]} edges
 */
export const applyCursorToEdges = edges => {
  return edges.map(edge => ({ cursor: apiCursor(edge._id), node: edge }))
}

/**
 * Dataset pagination wrapper
 * @param {function} query Function returning MongoDB query to apply pagination to
 * @param {object} options Query options such as {limit: 5, orderBy: {creation: 'descending'}}
 */
export const datasetsConnection = (query, options) => {
  // Limit to options.first or 100 datasets
  const limit = Math.min(options.first, 100)
  // Wait for the limited query to finish
  return sortQuery(query(), options)
    .limit(limit)
    .then(datasets => ({
      edges: applyCursorToEdges(datasets),
      pageInfo: {
        // True if there are no results before this
        hasPreviousPage: () => isFirst(query(), datasets[0]),
        // First ordered object id in the limited set
        startCursor: apiCursor(datasets[0]._id),
        // True if there are no results after this
        hasNextPage: () => isLast(query(), datasets.slice(-1).pop()),
        // Last ordered object id in the limited set
        endCursor: apiCursor(datasets.slice(-1).pop()._id),
      },
    }))
}

// Check if this is the first element in the full query
const isFirst = (query, first) => {
  return query()
    .limit(1)
    .then(r => r._id === first._id)
}

// Check if this is the last element in the full query
const isLast = (query, last) => {
  return query()
    .limit(1)
    .then(r => r._id === last._id)
}

/**
 * Apply any needed sorts to a query
 * @param {object} query Mongoose query object
 * @param {object} options Query parameters
 */
export const sortQuery = (query, options) => {
  let sort = {}
  if (options.orderBy.created) {
    sort['created'] = options.orderBy.created === 'ascending' ? 1 : -1
  }
  if (options.orderBy.uploader) {
    query.populate('uploader')
    sort['uploader.name'] = options.orderBy.uploader === 'ascending' ? 1 : -1
  }
  query.sort(sort)
  return query
}

// Apply range bounds based on after/before arguments to query
export const cursorBound = query => {}
