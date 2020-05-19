// dependencies ------------------------------------------------------------
import mongo from '../libs/mongo'

const c = mongo.collections

/**
 * Stars
 *
 * Handlers for dataset star interactions.
 */
export default {
  /**
   * Add Star
   *
   * Creates an entry in the c.crn.stars database
   */

  add(req, res, next) {
    const data = req.body
    const datasetId = data.datasetId
    const userId = data.userId

    c.crn.stars.insertOne(
      {
        datasetId: datasetId,
        userId: userId,
      },
      (err, response) => {
        if (err) {
          return next(err)
        } else {
          return res.send(response.ops)
        }
      },
    )
  },

  /**
   * Delete Star
   *
   * Removes an entry in the dataset stars database
   */

  delete(req, res, next) {
    const data = req.params
    const datasetId = data.datasetId ? data.datasetId : null
    const userId = data.userId ? data.userId : null

    // delete an entry in the c.crn.stars db
    // with the datasetId and userId
    c.crn.stars.deleteOne(
      {
        datasetId: datasetId,
        userId: userId,
      },
      err => {
        if (err) {
          return next(err)
        } else {
          return res.send()
        }
      },
    )
  },

  // read

  /**
   * Get Stars
   *
   * Returns a list of stars that are associated with a dataset
   */

  getStars(req, res, next) {
    const datasetId =
      req.params.datasetId === 'undefined' ? null : req.params.datasetId
    if (datasetId) {
      c.crn.stars
        .find({
          datasetId: datasetId,
        })
        .toArray((err, stars) => {
          if (err) {
            return next(err)
          }
          res.send(stars)
        })
    } else {
      c.crn.stars.find().toArray((err, stars) => {
        if (err) {
          return next(err)
        }
        res.send(stars)
      })
    }
  },
}
