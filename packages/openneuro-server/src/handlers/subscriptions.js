import notifications from '../libs/notifications'
import Subscription from '../models/subscription'
import mongoose from 'mongoose'
const ObjectID = mongoose.Schema.Types.ObjectId

/**
 * Subscriptions
 *
 * Handlers for subscription interactions.
 */
export const subscribe = (datasetId, userId) => {
  const subscription = new Subscription({ datasetId, userId })
  return subscription.save()
}

/**
 * Create Subscription
 *
 * Creates an entry in the c.crn.subscriptions database
 */
export const create = (req, res, next) => {
  const data = req.body
  const datasetId = data.datasetId
  const userId = data.userId

  subscribe(datasetId, userId)
    .then(response => res.send(response.$op))
    .catch(err => next(err))
}

/**
 * Delete Subscription
 *
 * Removes an entry in the subscriptions database
 */
export const deleteSubscription = (req, res, next) => {
  const data = req.params
  const datasetId = data.datasetId ? data.datasetId : null
  const userId = data.userId ? data.userId : null

  // delete an entry in the c.crn.subscriptions db
  // with the datasetId and userId
  Subscription.deleteOne({
    datasetId: datasetId,
    userId: userId,
  }).catch(err => {
    if (err) {
      return next(err)
    } else {
      return res.send()
    }
  })
}

export const deleteAll = (req, res, next) => {
  const data = req.params
  const datasetId = data.datasetId ? data.datasetId : null

  notifications.datasetDeleted(datasetId)
  Subscription.find({
    datasetId: datasetId,
  })
    .exec()
    .then(subscriptions => {
      subscriptions.forEach(subscription => {
        Subscription.deleteOne({
          _id: new ObjectID(subscription._id),
        })
      })
      return res.send()
    })
    .catch(err => {
      if (err) {
        return next(err)
      }
    })
}

// read

/**
 * Get Subscriptions
 *
 * Returns a list of subscriptions that are associated with a dataset
 */
export const getSubscriptions = (req, res, next) => {
  const datasetId =
    req.params.datasetId === 'undefined' ? null : req.params.datasetId
  if (datasetId) {
    Subscription.find({
      datasetId: datasetId,
    })
      .exec()
      .then(subscriptions => {
        res.send(subscriptions)
      })
      .catch(err => {
        return next(err)
      })
  } else {
    Subscription.find()
      .exec()
      .then(subscriptions => {
        res.send(subscriptions)
      })
      .catch(err => {
        return next(err)
      })
  }
}

/**
 * Check User Subscription
 *
 * Checks to see if a user is subscribed to a dataset
 */
export const checkUserSubscription = (req, res) => {
  const datasetId = req.params.datasetId
  const userId = req.params.userId

  Subscription.findOne({
    datasetId: datasetId,
    userId: userId,
  })
    .exec()
    .then(resp => {
      if (resp) {
        return res.send({ subscribed: true })
      } else {
        return res.send({ subscribed: false })
      }
    })
}
