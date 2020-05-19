import request from 'request'

/**
 * Parse Options
 *
 * Normalizes request options.
 */
function parseOptions(req, options) {
  if (options.query) {
    req.qs = options.query
  }
  if (options.body) {
    req.json = options.body
  }
  if (options.hasOwnProperty('encoding')) {
    req.encoding = options.encoding
  }
  if (options.headers) {
    for (const key in options.headers) {
      req.headers[key] = options.headers[key]
    }
  }
  return req
}

/**
 * Handle Request
 *
 * Processes all requests before they fire.
 */
function handleRequest(url, options, callback) {
  let req = {
    url: url,
    headers: {},
    qs: {},
    json: {},
  }

  req = parseOptions(req, options)
  callback(req)
}

/**
 * Handle Response
 *
 * Process all responses before they return
 * to the callback.
 */
function handleResponse(err, res, callback) {
  callback(err, res)
}

/**
 * Request
 *
 * A wrapper of npm 'request' to allow for
 * genericizing request and response manipulations.
 */
export default {
  get(url, options, callback) {
    handleRequest(url, options, req => {
      request.get(req, (err, res) => {
        handleResponse(err, res, callback)
      })
    })
  },

  /**
   * GET CACHE
   *
   * Functions the same as request but takes a
   * cache function, checks to see if the response is
   * already cached. If so, responds with the cached data.
   * If not, stores the response in the cache before responding.
   */
  getCache(url, cache, options, callback) {
    handleRequest(url, options, req => {
      cache.get(req, (err, res1) => {
        if (res1) {
          handleResponse(err, res1, callback)
        } else {
          request.get(req, (err, res2) => {
            if (err) {
              handleResponse(err, res2, callback)
            } else {
              const data = res2.body
              cache.store(data, () => {
                handleResponse(err, res2, callback)
              })
            }
          })
        }
      })
    })
  },

  postCache(url, cache, options, callback) {
    handleRequest(url, options, req => {
      request.post(req, (err, res) => {
        if (err) {
          handleResponse(err, res, callback)
        } else {
          const data = req.json
          cache.store(data, () => {
            handleResponse(err, res, callback)
          })
        }
      })
    })
  },

  /**
   * GET PROXY
   *
   * Functions the same as a get request but takes a
   * response object instead of a callback and pipes
   * the request response to the response object.
   */
  getProxy(url, options, res) {
    handleRequest(url, options, req => {
      request
        .get(req)
        .on('data', resp => {
          if (options.status) {
            resp.statusCode = options.status
          }
        })
        .pipe(res)
    })
  },

  post(url, options, callback) {
    handleRequest(url, options, req => {
      request.post(req, (err, res) => {
        handleResponse(err, res, callback)
      })
    })
  },

  put(url, options, callback) {
    handleRequest(url, options, req => {
      request.put(req, (err, res) => {
        handleResponse(err, res, callback)
      })
    })
  },

  del(url, options, callback) {
    handleRequest(url, options, req => {
      request.del(req, (err, res) => {
        handleResponse(err, res, callback)
      })
    })
  },
}
