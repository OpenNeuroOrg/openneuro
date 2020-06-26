import notifications from '../libs/notifications.js'
import moment from 'moment'
import jsdom from 'jsdom'
import User from '../models/user'
import Comment from '../models/comment'
import { ObjectID } from 'mongodb'
import MailgunIdentifier from '../models/mailgunIdentifier'
import { ContentState, convertFromHTML, convertToRaw } from 'draft-js'

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

/**
 * Reply to Comment via Email
 *
 * Creates an entry in the comments database,
 * ** maybe returns the newly created comment id
 */
export async function reply(req, res, next) {
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
    ? await MailgunIdentifier.findOne({ messageId: inReplyTo }).exec()
    : null
  if (!messageId) {
    return res.sendStatus(404)
  }
  const user = await User.findOne({ id: userId }).exec()
  const originalComment = await Comment.findOne({
    _id: ObjectID(parentId),
  }).exec()
  if (user && originalComment) {
    const flattenedUser = {
      id: user.id,
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
    Comment.create(comment, (err, response) => {
      if (err) {
        return next(err)
      } else {
        if (response.ops && response.ops.length) {
          comment = response.ops[0]
        }
        notifications.commentCreated(comment)
        return res.send(response.ops[0])
      }
    })
  } else {
    return res.sendStatus(404)
  }
}
