import request from 'superagent'

/*
 * Upload retries limit
 */
const maxRetries = 3

/**
 * Normalize Options
 *
 * Takes a request options object and
 * normalizes it so requests won't fail.
 */
function normalizeOptions(options) {
  options = options ? options : {}
  if (!options.headers) {
    options.headers = {}
  }
  if (!options.query) {
    options.query = {}
  }
  if (!options.hasOwnProperty('auth')) {
    options.auth = true
  }
  return options
}

/**
 * Handle Request
 *
 * A generic request handler used to intercept
 * requests before they request out. Ensures
 * access_token isn't expired sets it as the
 * Authorization header.
 *
 * Available options
 *   - headers: An object with keys set to the header name
 *   and values set to the corresponding header value.
 *   - query: An object with keys set to url query parameters
 *   and values set to the corresponding query values.
 *   - body: A http request body.
 *   - auth: A boolean determining whether the access token
 *   should be supplied with the request.
 *   - snapshot: A boolean that will add a 'snapshots' url
 *   param to scitran requests.
 */
function handleRequest(url, options, callback) {
  // normalize options to play nice with superagent requests
  options = normalizeOptions(options)

  return callback(url, options)
}

/**
 * Request
 *
 * A wrapper for the superagent request library.
 * Provides a place for global request settings
 * and response handling.
 */
const Request = {
  get(url, options) {
    return handleRequest(url, options, (url, options) => {
      return request
        .get(url)
        .set(options.headers)
        .query(options.query)
    })
  },

  post(url, options) {
    return handleRequest(url, options, (url, options) => {
      return request
        .post(url)
        .set(options.headers)
        .query(options.query)
        .send(options.body)
    })
  },

  put(url, options) {
    return handleRequest(url, options, (url, options) => {
      return request
        .put(url)
        .set(options.headers)
        .query(options.query)
        .send(options.body)
    })
  },

  del(url, options) {
    return handleRequest(url, options, (url, options) => {
      return request
        .del(url)
        .set(options.headers)
        .query(options.query)
    })
  },

  upload(url, options) {
    return handleRequest(url, options, (url, options) => {
      return request
        .post(url)
        .query(options.query)
        .set(options.headers)
        .field('tags', options.fields.tags)
        .attach('file', options.fields.file, options.fields.name)
        .retry(maxRetries)
    })
  },
}

export default Request
