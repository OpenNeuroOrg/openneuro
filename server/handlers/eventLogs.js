import mongo from '../libs/mongo'
import config from '../config'
import scitran from '../libs/scitran'

let c = mongo.collections
let events = Object.keys(config.events)
// handlers ----------------------------------------------------------------

/**
 * Event Logs
 *
 * Handlers for event logs.
 */
let handlers = {
  getEventLogs(req, res, next) {
    // This stuff could be a middleware?
    let limit = 30
    /*eslint-disable no-unused-vars*/
    let skip = 0
    let reqLimit = parseInt(req.query.limit)
    let reqSkip = parseInt(req.query.skip)
    if (!isNaN(reqLimit) && reqLimit < limit) {
      limit = req.query.limit
    }
    if (!isNaN(reqSkip) && reqSkip) {
      skip = reqSkip
    }

    c.crn.logs
      .find({ type: { $in: events } }, { sort: [['date', 'desc']] })
      .toArray((err, logs) => {
        if (err) return next(err)

        const userPromises = logs.map(log => {
          return new Promise(resolve => {
            scitran.getUser(log.user, (err, response) => {
              log.userMetadata = {}
              if (response.statusCode == 200) {
                log.userMetadata = response.body
              }
              resolve()
            })
          })
        })

        Promise.all(userPromises).then(() => {
          res.send(logs)
        })
      })
  },
}

export default handlers
