import Comment from "../../models/comment"
import type { CommentDocument } from "../../models/comment"
import notifications from "../../libs/notifications"
import { user } from "./user.js"
import { checkAdmin } from "../permissions"
import type { GraphQLContext } from "../builder"

export const comment = (
  obj: unknown,
  { id }: { id: string },
): Promise<CommentDocument | null> => {
  return Comment.findOne({ _id: id }).exec()
}

export const datasetComments = (
  obj: { id: string },
): Promise<CommentDocument[]> => {
  return Comment.find({ datasetId: obj.id }).exec()
}

export const userComments = (
  obj: { id: string },
): Promise<CommentDocument[]> => {
  return Comment.find({ "user._id": obj.id }).exec()
}

const replies = (obj: CommentDocument): Promise<CommentDocument[]> => {
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
const allNestedReplies = async (obj: { _id: string }) => {
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
  obj: unknown,
  { datasetId, parentId, comment: text }: {
    datasetId: string
    parentId?: string
    comment: string
  },
  { user }: GraphQLContext,
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
  obj: unknown,
  { commentId, comment: text }: { commentId: string; comment: string },
  { user }: GraphQLContext,
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
  obj: unknown,
  { commentId, deleteChildren = true }: {
    commentId: string
    deleteChildren?: boolean
  },
  { user, userInfo }: GraphQLContext,
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
  parent: (obj: CommentDocument) => comment(obj, { id: obj.parentId }),
  replies,
  user: (obj: CommentDocument) => user(obj, { id: obj.user._id }),
}

export default CommentFields
