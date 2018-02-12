// dependencies ------------------------------------------------------------
import scitran from '../libs/scitran'
import mongo from '../libs/mongo'
import { ObjectID } from 'mongodb'
import config from '../config'
import bidsId from '../libs/bidsId'
import notifications from '../libs/notifications'
import url from 'url'

let c = mongo.collections

// handlers ----------------------------------------------------------------

/**
 * Subscriptions
 *
 * Handlers for subscription interactions.
 */
export default {
  // write

  /**
  * Create Subscription
  *
  * Creates an entry in the c.crn.subscriptions database
  */

  create(req, res, next) {
    let data = req.body
    let datasetId = data.datasetId
    let userId = data.userId

    c.crn.subscriptions.insertOne(
      {
        datasetId: datasetId,
        userId: userId,
      },
      (err, response) => {
        if (err) {
          console.log('error in mongo db subscriotions create():', err)
          return next(err)
        } else {
          console.log('sucessfully created a subscription!')
          return res.send(response.ops)
        }
      },
    )
  },

  /**
   * Delete Subscription
   * 
   * Removes an entry in the subscriptions database
   */

  delete(req, res, next) {
    let data = req.params
    let datasetId = data.datasetId ? data.datasetId : null
    let userId = data.userId ? data.userId : null
    
    // delete an entry in the c.crn.subscriptions db
    // with the datasetId and userId
    c.crn.subscriptions.deleteOne(
      {
        datasetId: datasetId,
        userId: userId,
      },
      err => {
        if (err) {
          console.log('error in mongo db subscriotions create():', err)
          return next(err)
        } else {
          console.log(
            'sucessfully deleted a subscription! response data:',
            data,
          )
          return res.send()
        }
      },
    )
  },

  // read

  /**
  * Get Subscriptions
  *
  * Returns a list of subscriptions that are associated with a dataset
  */

  getSubscriptions(req, res, next) {
    let datasetId = req.params.datasetId

    c.crn.subscriptions
      .find({
        datasetId: datasetId,
      })
      .toArray((err, subscriptions) => {
        if (err) {
          return next(err)
        }
        res.send(subscriptions)
      })
  },
}
