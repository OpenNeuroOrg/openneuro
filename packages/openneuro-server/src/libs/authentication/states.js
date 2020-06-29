/** Middleware to check for authorization states on top of authentication */

import Dataset from '../../models/dataset'
import Permission from '../../models/permission'
import Comment from '../../models/comment'
import bidsId from '../bidsId'
import { Types } from 'mongoose'
const { ObjectID } = Types

/**
 * Authenticated
 *
 * Checks if a request contains a valid user.
 * Throws an error or calls next function.
 */
export const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    return res.status(401).send({ error: 'Not logged in.' })
  }
}

/**
 * Optional
 *
 * Calls next regardless of the
 * user info stored in the request object
 */
export const optional = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    return next()
  }
}

/**
 * Super User
 *
 * Checks if a request has user info with admin level access.
 * Throws an error or calls next function.
 */
export const superuser = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.admin) {
      return next()
    } else {
      return res.status(401).send({ error: 'You do not have admin access.' })
    }
  } else {
    return res.status(401).send({ error: 'Not logged in.' })
  }
}

/**
 * Dataset Access
 *
 * Takes in the request user and a datasetId as
 * a url or query param and adds a hasAccess property to
 * the request object.
 */
export const datasetAccess = (req, res, next) => {
  let datasetId = req.params.datasetId
    ? req.params.datasetId
    : req.query.datasetId

  datasetId = bidsId.decodeId(datasetId) // handle old dataset request methods that encode ids

  // check to make sure that the dataset exists
  return Dataset.findOne({ id: datasetId })
    .exec()
    .then(dataset => {
      // if dataset does not exist, return 404 error
      if (!dataset) {
        return res
          .status(404)
          .send({ error: 'The dataset you have requested does not exist.' })
      }

      // if there is no user option on the request,
      // then this passed through 'optional' auth middleware
      // and we can ignore the fact that there are no permissions.
      // if the dataset is public, then thereare no restrictions on
      // the permissions either. if the user is superuser, then additionally
      // the user has access
      if (!req.user || dataset.public || req.user.admin) {
        req.hasAccess = true
        return next()
      }

      // find permissions information for this user & dataset
      Permission.findOne({ datasetId: datasetId, userId: req.user.id })
        .exec()
        .then(permission => {
          if (permission) {
            req.hasAccess = true
            return next()
          } else {
            return res
              .status(401)
              .send({ error: 'You do not have access to this dataset.' })
          }
        })
        .catch(err => res.status(404).send(err))
    })
    .catch(err => res.status(404).send(err))
}

/**
 * Comment Access
 *
 * Determines whether the user has the right
 * to update / delete a comment
 */
export const commentAccess = (req, res, next) => {
  const commentId = req.params.commentId
  if (req.user.admin) {
    return next()
  }
  Comment.findOne({
    _id: ObjectID(commentId),
  })
    .exec()
    .then(comment => {
      if (comment.userId === req.user.id) {
        return next()
      } else {
        return res
          .status(401)
          .send({ error: 'You do not have access to this comment.' })
      }
    })
    .catch(err => res.status(404).send(err))
}
