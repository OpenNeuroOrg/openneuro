import config from '../config'
import request from '../libs/request'
import crypto from 'crypto'
import mongo from '../libs/mongo'
import { ObjectID } from 'mongodb'

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
    let comment = req.body

    c.crn.comments.insertOne(comment, (err, response) => {
      if (err) {
        return next(err)
      }
      res.send(response.ops)
    })
  },

  /**
  * Update Comment
  *
  * Updates an entry in the comments database, 
  */
  update(req, res, next) {
    let comment = req.body
    let commentId = req.params.commentId

    c.crn.comments.updateOne(
      { _id: ObjectID(commentId) },
      { $set: { text: comment.text } },
      (err) => {
        if (err) {
          return next(err)
        }
        res.send()
      },
    )
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
    c.crn.comments.deleteOne({ _id: ObjectID(commentId) }, err => {
      if (err) {
        return next(err)
      }
      // delete the children of that comment
      if (parentId) {
        c.crn.comments.deleteMany({ parentId: commentId }, err => {
          if (err) {
            return next(err)
          }
          return res.send()
        })
      }
      return res.send()
    })
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