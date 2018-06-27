// dependencies ------------------------------------------------------------
import mongo from '../libs/mongo'
import { ObjectID } from 'mongodb'
import notifications from '../libs/notifications'

let c = mongo.collections

// handlers ----------------------------------------------------------------

/**
 * Subscriptions
 *
 * Handlers for subscription interactions.
 */

// write

/**
 * Create Subscription
 *
 * Creates an entry in the c.crn.subscriptions database
 */
export const create = (req, res, next) => {
  let data = req.body
  let datasetId = data.datasetId
  let userId = data.userId

  subscribe(datasetId, userId)
    .then(response => res.send(response.ops))
    .catch(err => next(err))
}

export const subscribe = (datasetId, userId) => {
  return new Promise((resolve, reject) => {
    c.crn.subscriptions.insertOne(
      {
        datasetId: datasetId,
        userId: userId,
      },
      (err, response) => {
        if (err) {
          reject(err)
        }
        resolve(response)
      },
    )
  })
}

/**
 * Delete Subscription
 *
 * Removes an entry in the subscriptions database
 */

export const deleteSubscription = (req, res, next) => {
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
        return next(err)
      } else {
        return res.send()
      }
    },
  )
}

export const deleteAll = (req, res, next) => {
  let data = req.params
  let datasetId = data.datasetId ? data.datasetId : null

  notifications.datasetDeleted(datasetId)
  c.crn.subscriptions
    .find({
      datasetId: datasetId,
    })
    .toArray((err, subscriptions) => {
      if (err) {
        return next(err)
      }
      subscriptions.forEach(subscription => {
        c.crn.subscriptions.deleteOne({
          _id: ObjectID(subscription._id),
        })
      })
      return res.send()
    })
}

// read

/**
 * Get Subscriptions
 *
 * Returns a list of subscriptions that are associated with a dataset
 */

export const getSubscriptions = (req, res, next) => {
  let datasetId =
    req.params.datasetId === 'undefined' ? null : req.params.datasetId
  if (datasetId) {
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
  } else {
    c.crn.subscriptions.find().toArray((err, subscriptions) => {
      if (err) {
        return next(err)
      }
      res.send(subscriptions)
    })
  }
}

/**
 * Check User Subscription
 *
 * Checks to see if a user is subscribed to a dataset
 */

export const checkUserSubscription = (req, res) => {
  let datasetId = req.params.datasetId
  let userId = req.params.userId

  c.crn.subscriptions
    .findOne({
      datasetId: datasetId,
      userId: userId,
    })
    .then(resp => {
      if (resp) {
        return res.send({ subscribed: true })
      } else {
        return res.send({ subscribed: false })
      }
    })
}
