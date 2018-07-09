// dependencies ------------------------------------------------------------

import scitran from '../libs/scitran'
import mongo from '../libs/mongo'
import orcid from '../libs/orcid'
import { generateApiKey } from '../libs/apikey'

let c = mongo.collections

// handlers ----------------------------------------------------------------

/**
 * Users
 *
 * Handlers for user actions.
 */
export default {
  // create --------------------------------------------------------------

  validateORCIDToken(req, res) {
    let { code, home } = req.query
    if (!home) {
      res.set('Content-Type', 'text/html')
      res
        .status(200)
        .send(
          '<!doctype html><meta charset=utf-8><title>Logged in!</title><script>window.onload = function () {window.close()}</script>',
        )
      return
    }
    orcid.validateToken(code, (error, result) => {
      if (error) {
        res.status(403).send({ error })
      } else {
        res.send(result)
      }
    })
  },

  refreshORCIDToken(req, res) {
    let { refreshToken } = req.query
    orcid.refreshToken(refreshToken, (error, result) => {
      if (error) {
        res.status(403).send({ error })
      } else {
        res.send(result)
      }
    })
  },

  getORCIDProfile(req, res) {
    let { accessToken } = req.query
    orcid.getProfile(accessToken, (error, result) => {
      res.send(error ? error : result)
    })
  },

  /**
   * Create User
   *
   * Takes a gmail address as an '_id' and a name and
   * creates a scitran user.
   */
  create(req, res) {
    let user = req.body
    c.crn.blacklist.findOne({ _id: user._id }).then(item => {
      if (item) {
        res.send({
          status: 403,
          error:
            'This user email has been blacklisted and cannot be given an account',
        })
      } else {
        // Only pass on scitran's required user fields
        let scitranUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
        scitran.createUser(scitranUser, (err, resp) => {
          if (!err) {
            res.send(resp)
          }
        })
      }
    })
  },

  /**
   * Blacklist User
   *
   * Take a gmail address as an '_id' and optionally takes a name and note and sets the user info as blacklisted.
   */
  blacklist(req, res, next) {
    let user = req.body
    c.crn.blacklist.findOne({ _id: user._id }).then(item => {
      if (item) {
        let error = new Error(
          'A user with that _id has already been blacklisted',
        )
        error.http_code = 409
        return next(error)
      } else {
        c.crn.blacklist.insertOne(user, { w: 1 }, err => {
          if (err) {
            return next(err)
          }
          res.send(user)
        })
      }
    })
  },

  /**
   * Create API Key
   */
  createAPIKey(req, res, next) {
    generateApiKey(req.user)
      .then(key => res.send(key))
      .catch(err => next(err))
  },

  // read ----------------------------------------------------------------

  /**
   * Get Blacklist
   *
   * Returns a list of blacklisted users.
   */
  getBlacklist(req, res, next) {
    c.crn.blacklist.find().toArray((err, docs) => {
      if (err) {
        return next(err)
      }
      res.send(docs)
    })
  },

  // delete --------------------------------------------------------------

  /**
   * UnBlacklist
   *
   * Takes a user id (email) as a url parameter
   * and removes the user from the blacklist
   * if they were blacklisted.
   */
  unBlacklist(req, res, next) {
    let userId = req.params.id
    c.crn.blacklist.findAndRemove({ _id: userId }, [], (err, doc) => {
      if (err) {
        return next(err)
      }
      if (!doc.value) {
        let error = new Error('A user with that id was not found')
        error.http_code = 404
        return next(error)
      }
      res.send({ message: 'User ' + userId + ' has been un-blacklisted.' })
    })
  },
}
