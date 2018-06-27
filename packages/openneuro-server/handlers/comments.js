import mongo from '../libs/mongo'
import notifications from '../libs/notifications.js'
import moment from 'moment'
import jsdom from 'jsdom'
import { ObjectID } from 'mongodb'
import { ContentState, convertFromHTML, convertToRaw } from 'draft-js'

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
    /* eslint-disable no-console */
    let comment
    const parentId = req.params.commentId
      ? decodeURIComponent(req.params.commentId)
      : null
    const userId = req.params.userId
      ? decodeURIComponent(req.params.userId)
      : null
    const text = textToDraft(req.body['stripped-text'])
    const inReplyToRaw = req.body['In-Reply-To']
    const inReplyTo = inReplyToRaw
      ? inReplyToRaw.replace('<', '').replace('>', '')
      : null
    const messageId = inReplyTo
      ? await c.crn.mailgunIdentifiers.findOne({ messageId: inReplyTo })
      : null
    if (!messageId) {
      return res.sendStatus(404)
    }
    const user = await c.scitran.users.findOne({ _id: userId })
    let originalComment = await c.crn.comments.findOne({
      _id: ObjectID(parentId),
    })
    if (user && originalComment) {
      let flattenedUser = {
        _id: user._id,
        email: user.email,
        name: user.name,
      }
      comment = {
        datasetId: originalComment.datasetId,
        datasetLabel: originalComment.datasetLabel,
        parentId: parentId,
        text: text,
        user: flattenedUser,
        createDate: moment().format(),
      }
      c.crn.comments.insertOne(comment, (err, response) => {
        if (err) {
          return next(err)
        } else {
          if (response.ops && response.ops.length) {
            comment = response.ops[0]
          }
          notifications.commentCreated(comment)
          console.log('created comment. sending this back:', response.ops[0])
          return res.send(response.ops[0])
        }
      })
    } else {
      return res.sendStatus(404)
    }
    /* eslint-enable no-console*/
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

// helpers --------------------
/**
 * Text to Draft Content
 *
 * Takes a string and returns a stringified json
 * item that can be stored as if it came from
 * a client-side draft.js editor
 */
const textToDraft = text => {
  const window = new jsdom.JSDOM('').window
  global.document = window.document
  global.HTMLElement = window.HTMLElement
  global.HTMLAnchorElement = window.HTMLElement
  return JSON.stringify(
    convertToRaw(ContentState.createFromBlockArray(convertFromHTML(text))),
  )
}
