import scitran from './scitran'
import { ObjectID } from 'mongodb'
import mongo from './mongo'

let c = mongo.collections

/**
 * Authorization
 *
 * Authorization middleware.
 */
let auth = {
  /**
     * User
     *
     * Checks if a request contains an access token
     * for a valid user. Throws an error or calls next
     * function.
     */
  user(req, res, next) {
    scitran.getUserByToken(req.headers.authorization, (err, resp) => {
      if (err || resp.body.code === 400 || resp.body.code === 401) {
        res.status(401).send({ error: 'You must have a valid access token.' })
      } else {
        req.user = resp.body._id
        req.isSuperUser = resp.body.root
        return next()
      }
    })
  },

  /**
     * Super User
     *
     * Checks if a request contains an access token
     * for a valid superuser. Throws an error or calls next
     * function.
     */
  superuser(req, res, next) {
    scitran.getUserByToken(req.headers.authorization, (err, resp) => {
      if (err || !resp.body.root) {
        res.status(403).send({ error: 'You must have admin privileges.' })
      } else {
        req.user = resp.body._id
        req.isSuperUser = resp.body.root
        return next()
      }
    })
  },

  /**
     * Optional
     *
     * If a request has a valid access token it will
     * append the user id to the req object. Will
     * not throw an error. Used for requests that may
     * work with varying levels of access.
     */
  optional(req, res, next) {
    scitran.getUserByToken(req.headers.authorization, (err, resp) => {
      if (resp.body && resp.body._id) {
        req.user = resp.body._id
        req.isSuperUser = resp.body.root
      }
      return next()
    })
  },

  /**
     * Dataset Access
     *
     * Takes in the authorization header and a datasetId as
     * a url or query param and adds a hasAccess property to
     * the request object.
     */
  datasetAccess(options) {
    options = options ? options : { optional: false }
    return function(req, res, next) {
      let snapshot =
        req.query.hasOwnProperty('snapshot') && req.query.snapshot == 'true'
      let datasetId = req.params.datasetId
        ? req.params.datasetId
        : req.query.datasetId
      auth.optional(req, res, () => {
        scitran.getProject(
          datasetId,
          (err, resp1) => {
            if (resp1.body.code && resp1.body.code == 404) {
              return res.status(404).send({ error: resp1.body.detail })
            }

            let hasAccess = !!resp1.body.public || req.isSuperUser
            if (resp1.body.permissions && !hasAccess) {
              for (let permission of resp1.body.permissions) {
                if (permission._id == req.user) {
                  hasAccess = true
                  break
                }
              }
            }
            req.hasAccess = hasAccess

            if (!options.optional && !req.hasAccess) {
              return res
                .status(403)
                .send({ error: 'You do not have access to this dataset.' })
            }

            return next()
          },
          { snapshot },
        )
      })
    }
  },

  /**
     * Delete Comment Access
     *
     * Determines whether the user has the right
     * to delete a comment
     */
  deleteCommentAccess(req, res, next) {
    let commentId = req.params.commentId
    let user = req.user
    let admin = !!req.isSuperUser

    if (admin) {
      return next()
    }

    c.crn.comments.findOne(
      {
        _id: ObjectID(commentId),
      },
      (err, comment) => {
        let commentOwner = comment.userId
        if (commentOwner === user) {
          return next()
        }

        return res
          .status(403)
          .send({ error: 'You do not have access to delete this comment.' })
      },
    )
  },

  /**
    * Check to see if user is an admin user. If so, just next()
    * if not, prevent user from having more than 2 jobs running concurrently
    * NOTE: this middleware function depends on auth middleware that attaches user and isSuperUser to req having already run
    */
  submitJobAccess(req, res, next) {
    let user = req.user
    let admin = !!req.isSuperUser
    if (admin) {
      return next()
    }

    c.crn.jobs
      .find({
        userId: user,
        'analysis.status': {
          $nin: ['SUCCEEDED', 'FAILED', 'REJECTED', 'CANCELED'],
        },
      })
      .toArray((err, jobs) => {
        let totalRunningJobs = jobs.length
        if (totalRunningJobs < 2) {
          return next()
        }

        return res
          .status(403)
          .send({ error: 'You only have access to run 2 concurrent jobs.' })
      })
  },

  rerunJobAccess(req, res, next) {
    let jobId = req.params.jobId
    let mongoJobId = typeof jobId != 'object' ? ObjectID(jobId) : jobId
    let user = req.user
    let admin = !!req.isSuperUser
    if (admin) {
      return next()
    }

    c.crn.jobs.findOne(
      {
        _id: mongoJobId,
      },
      (err, job) => {
        let jobOwner = job.userId
        if (jobOwner === user) {
          return next()
        }

        return res
          .status(403)
          .send({ error: 'You do not have access to rerun this job.' })
      },
    )
  },

  deleteJobAccess(req, res, next) {
    let jobId = req.params.jobId
    let mongoJobId = typeof jobId != 'object' ? ObjectID(jobId) : jobId
    let user = req.user
    let admin = !!req.isSuperUser
    if (admin) {
      return next()
    }

    c.crn.jobs.findOne(
      {
        _id: mongoJobId,
      },
      (err, job) => {
        let jobOwner = job.userId
        if (jobOwner === user) {
          return next()
        }

        return res
          .status(403)
          .send({ error: 'You do not have access to delete this job.' })
      },
    )
  },

  /**
     * Ticket
     *
     * Checks for a valid ticket parameter
     */
  ticket(req, res, next) {
    let ticket = req.query.ticket

    if (!ticket) {
      return res
        .status(400)
        .send({ error: 'No download ticket query parameter found.' })
    }

    c.crn.tickets.findOne({ _id: ObjectID(ticket) }, {}, (err, result) => {
      if (err || !result) {
        return res
          .status(401)
          .send({ error: 'Download ticket was not found or expired' })
      }
      req.ticket = result
      return next()
    })
  },
}

export default auth
