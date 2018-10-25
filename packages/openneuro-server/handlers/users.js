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
