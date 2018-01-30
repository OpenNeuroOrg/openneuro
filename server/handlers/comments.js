import config from '../config'
import request from '../libs/request'
import crypto from 'crypto'
import mongo from '../libs/mongo'

let c = mongo.collections

// handlers ----------------------------------------------------------------

/**
 * Comments
 *
 * Handlers for comment actions. 
 */

export default {
  // write
  /**
  * Create Comment
  *
  * Creates an entry in the comments database, 
  * ** maybe returns the newly created comment id
  */
  create(req, res, next) {
    console.log('server/handlers/comments/create with data:', req.body, req.params.datasetId)
    let comment = req.body
    let datasetId = req.params.datasetId

    c.crn.comments.insertOne(comment, (err, response) => {
      console.log('server err:', err, 'server response:', response)
      if (err) {
        return next(err)
      }
      res.send(response.ops)
    })
  },

  /**
   * Delete Comment
   * 
   * Removes an entry in the comments database, as well as any
   * replies to a comment
   */
  delete(req, res, next) {
    const commentId = req.params.commentId
    const parentId = req.body.parentId

    // delete the comment in question
    c.crn.comments.deleteOne(
      { commentId: commentId}, {},
      err => {
        if (err) {
          return next(err)
        }

        // delete the children of that comment
        if (parentId) {
          c.crn.comments.deleteMany(
            { parentId: commentId}, {},
            err => {
              if (err) {
                return next(err)
              }
              return res.send()
            },
          )
        }

        return res.send()
      },
    )
  },

  // read ------------------------------------------

  /**
  * Get Comments
  *
  * Returns a list of comments that are associated with a dataset
  */
  getComments(req, res, next) {
    let datasetId = req.params.datasetId

    c.crn.comments
      .find({
        datasetId: datasetId,
      })
      .toArray((err, comments) => {
        if (err) {
          return next(err)
        }
        res.send(comments)
      })
  },
}