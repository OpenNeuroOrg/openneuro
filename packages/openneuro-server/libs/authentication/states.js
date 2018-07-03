/** Middleware to check for authorization states on top of authentication */

import mongo from '../mongo'
import { ObjectID } from 'mongodb'
let c = mongo.collections

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
    res.status(401).send({ error: 'Not logged in.' })
    return next()
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
      res.status(401).send({ error: 'You do not have admin access.' })
      return next()
    }
  } else {
    res.status(401).send({ error: 'Not logged in.' })
    return next()
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
  const datasetId = req.params.datasetId
    ? req.params.datasetId
    : req.query.datasetId

  // check to make sure that the dataset exists
  return c.crn.datasets
    .findOne({ id: datasetId })
    .then(data => {
      // if dataset does not exist, return 404 error
      if (!data.dataset.length) {
        res
          .status(404)
          .send({ error: 'The dataset you have requested does not exist.' })
        return next()
      }

      // if there is no user option on the request,
      // then this passed through 'optional' auth middleware
      // and we can ignore the fact that there are no permissions.
      // if the dataset is public, then thereare no restrictions on
      // the permissions either. if the user is superuser, then additionally
      // the user has access
      if (!req.user || data.dataset.public || req.user.admin) {
        return next()
      }

      // find permissions information for this user & dataset
      c.crn.permissions
        .findOne({ datasetId: datasetId, userId: req.user.id })
        .then(data => {
          if (data && data.permissions) {
            return next()
          } else {
            res
              .status(401)
              .send({ error: 'You do not have access to this dataset.' })
            return next()
          }
        })
        .catch(err => {
          res.status(404).send(err)
          return next()
        })
    })
    .catch(err => {
      res.status(404).send(err)
      return next()
    })
}

/**
 * Comment Access
 *
 * Determines whether the user has the right
 * to update / delete a comment
 */
export const commentAccess = (req, res, next) => {
  let commentId = req.params.commentId
  if (req.user.admin) {
    return next()
  }
  c.crn.comments
    .findOne({
      _id: ObjectID(commentId),
    })
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

/**
 * Check to see if user is an admin user. If so, just next()
 * if not, prevent user from having more than 2 jobs running concurrently
 * NOTE: this middleware function depends on auth middleware that attaches user and isSuperUser to req having already run
 */
export const submitJobAccess = (req, res, next) => {
  if (req.user.admin) {
    return next()
  }

  c.crn.jobs
    .find({
      userId: req.user.id,
      'analysis.status': {
        $nin: ['SUCCEEDED', 'FAILED', 'REJECTED', 'CANCELED'],
      },
    })
    .toArray((err, jobs) => {
      if (err) {
        res.status(404).send(err)
        return next()
      }
      let totalRunningJobs = jobs.length
      if (totalRunningJobs < 2) {
        return next()
      }

      res
        .status(403)
        .send({ error: 'You only have access to run 2 concurrent jobs.' })
      return next()
    })
}

export const rerunJobAccess = (req, res, next) => {
  let jobId = req.params.jobId
  let mongoJobId = typeof jobId != 'object' ? ObjectID(jobId) : jobId
  if (req.user.admin) {
    return next()
  }

  c.crn.jobs
    .findOne({
      _id: mongoJobId,
    })
    .then(job => {
      let jobOwner = job.userId
      if (jobOwner === req.user.id) {
        return next()
      }

      res
        .status(401)
        .send({ error: 'You do not have access to rerun this job.' })
      return next()
    })
    .catch(err => {
      res.status(404).send(err)
      return next()
    })
}

export const deleteJobAccess = (req, res, next) => {
  let jobId = req.params.jobId
  let mongoJobId = typeof jobId != 'object' ? ObjectID(jobId) : jobId
  if (req.user.admin) {
    return next()
  }

  c.crn.jobs
    .findOne({
      _id: mongoJobId,
    })
    .then(job => {
      let jobOwner = job.userId
      if (jobOwner === req.user.id) {
        return next()
      }

      res
        .status(401)
        .send({ error: 'You do not have access to delete this job.' })

      return next()
    })
    .catch(err => {
      res.status(404).send(err)
      return next()
    })
}
