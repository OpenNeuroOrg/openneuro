import mongo from '../libs/mongo'
import notifications from '../libs/notifications.js'
import moment from 'moment'
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
      } else {
        if (response.ops && response.ops.length) {
          comment = response.ops[0]
        }
        notifications.commentCreated(comment)
        res.send(response.ops)
      }
    })
  },

  /**
   * Reply to Comment via Email
   *
   * Creates an entry in the comments database,
   * ** maybe returns the newly created comment id
   */
  async reply(req, res, next) {
    let comment
    console.log('req:', req)
    console.log('res:', res)

    const parentId = req.params.commentId
    const userId = req.params.userId

    console.log('parentId:', parentId)
    console.log('userId:', userId)

    const text = req.data['stripped-text']
    console.log('text:', text)

    c.scitran.users.findOne({_id: userId}).then(user => {
      console.log('user:', user)

      let originalComment
      c.crn.comments.findOne({_id: ObjectID(parentId)}).then((err, response) => {
        if (err) {
          console.log('there was an error getting the parent comment for this email reply')
          res.send(404)
        } else {
          originalComment = response.body
        }
  
        console.log('original comment:', originalComment)
  
        if (user && originalComment) {
          comment = {
            datasetId: originalComment.datasetId,
            datasetLabel: originalComment.datasetLabel,
            parentId: parentId,
            text: text,
            user: user.profile,
            createDate: moment().format(),
          }
  
          console.log('comment being created...')
          console.log('comment:', comment)
          c.crn.comments.insertOne(comment, (err, response) => {
            if (err) {
              return next(err)
            } else {
              if (response.ops && response.ops.length) {
                comment = response.ops[0]
              }
              notifications.commentCreated(comment)
              res.send(response.ops)
            }
          })
        }
      })
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
      { $set: { text: comment.text, edited: true } },
      err => {
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
    // delete the comment in question
    c.crn.comments.updateOne(
      { _id: ObjectID(commentId) },
      { $set: { deleted: true } },
      err => {
        if (err) {
          return next(err)
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
        // remove text and user info from deleted comments before sending back to the server
        let filteredComments = comments.map(comment => {
          if (comment.deleted) {
            comment.user = {}
            comment.text = '[deleted]'
            return comment
          } else {
            return comment
          }
        })
        res.send(filteredComments)
      })
  },
}
