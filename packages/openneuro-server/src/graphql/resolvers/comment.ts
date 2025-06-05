import Comment from "../../models/comment"
import notifications from "../../libs/notifications"
import { user } from "./user.js"
import { checkAdmin } from "../permissions"

export const comment = (obj, { id }) => {
  return Comment.findOne({ _id: id }).exec()
}

export const datasetComments = (obj) => {
  return Comment.find({ datasetId: obj.id }).exec()
}

export const userComments = (obj) => {
  return Comment.find({ "user._id": obj.id }).exec()
}

const replies = (obj) => {
  return Comment.find({ parentId: obj._id }).exec()
}

/**
 * Flattens an array of arrays
 * @param {*[][]} arr
 * @returns {*[]}
 */
export const flatten = (arr) => [].concat(...arr)

/**
 * returns a flat array of all the dependencies of the given comment
 * @param {import('../../models/comment').CommentDocument} obj
 * @returns {Promise<import('../../models/comment').CommentDocument[]>}
 */
const allNestedReplies = async (obj) => {
  const replies = await Comment.find({ parentId: obj._id }).exec()
  if (!replies.length) {
    return replies
  } else {
    const nestedReplies = await Promise.all(replies.map(allNestedReplies))
    return flatten([replies, ...nestedReplies])
  }
}

/**
 * Insert new comment and return the comment _id for replies to reference
 */
export const addComment = (
  obj,
  { datasetId, parentId, comment: text },
  { user },
) => {
  if (!user) {
    return Promise.reject(
      new Error("You must be logged in to write a comment."),
    )
  }
  const newComment = new Comment({
    datasetId,
    parentId,
    text,
    user: { _id: user },
  })
  return newComment.save().then((commentInsert) => {
    notifications.commentCreated(commentInsert)
    return commentInsert._id
  })
}

export const editComment = async (
  obj,
  { commentId, comment: text },
  { user },
) => {
  const existingComment = await Comment.findById(commentId).exec()
  // You may only edit your own comments
  if (existingComment.user._id === user) {
    existingComment.text = text
    return existingComment.save().then(() => true)
  } else {
    return Promise.reject(new Error("You may only edit your own comments."))
  }
}

export const deleteComment = async (
  obj,
  { commentId, deleteChildren = true },
  { user, userInfo },
) => {
  await checkAdmin(user, userInfo)

  const existingComment = await Comment.findById(commentId).exec()
  const targetComments = [existingComment]
  if (deleteChildren) {
    targetComments.push(...(await allNestedReplies(existingComment)))
  }
  const deletedCommentIds = targetComments.map((c) => c._id)
  return Comment.deleteMany({
    _id: {
      $in: deletedCommentIds,
    },
  }).then(() => deletedCommentIds)
}

//"5c9bf7e3088cea6fa775c42a"
const CommentFields = {
  parent: (obj) => comment(obj, { id: obj.parentId }),
  replies,
  user: (obj) => user(obj, { id: obj.user._id }),
}

export default CommentFields
