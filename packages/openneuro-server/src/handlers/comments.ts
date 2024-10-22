import notifications from "../libs/notifications.js"
import format from "date-fns/format"
import User from "../models/user"
import Comment from "../models/comment"
import MailgunIdentifier from "../models/mailgunIdentifier"
import { ContentState, convertFromHTML, convertToRaw } from "draft-js"
import mongoose from "mongoose"
const ObjectID = mongoose.Schema.Types.ObjectId

/**
 * Text to Draft Content
 *
 * Takes a string and returns a stringified json
 * item that can be stored as if it came from
 * a client-side draft.js editor
 */
const textToDraft = (text) => {
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
  let comment
  const parentId = req.params.commentId
    ? decodeURIComponent(req.params.commentId)
    : null
  const userId = req.params.userId
    ? decodeURIComponent(req.params.userId)
    : null
  const text = textToDraft(req.body["stripped-text"])
  const inReplyToRaw = req.body["In-Reply-To"]
  const inReplyTo = inReplyToRaw
    ? inReplyToRaw.replace("<", "").replace(">", "")
    : null
  const messageId = inReplyTo
    ? await MailgunIdentifier.findOne({ messageId: inReplyTo }).exec()
    : null
  if (!messageId) {
    return res.sendStatus(404)
  }
  const user = await User.findOne({ id: userId }).exec()
  const originalComment = await Comment.findOne({
    // @ts-expect-error This is needed as an object and also a type
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
      createDate: format(new Date()),
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
