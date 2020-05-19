import Comment from '../../models/comment'
import notifications from '../../libs/notifications.js'
import { user } from './user.js'

export const comment = (obj, { id }) => {
  return Comment.findOne({ _id: id }).exec()
}

export const datasetComments = obj => {
  return Comment.find({ datasetId: obj.id }).exec()
}

export const userComments = obj => {
  return Comment.find({ 'user._id': obj.id }).exec()
}

const replies = obj => {
  return Comment.find({ parentId: obj._id }).exec()
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
      new Error('You must be logged in to write a comment.'),
    )
  }
  const newComment = new Comment({
    datasetId,
    parentId,
    text,
    user: { _id: user },
  })
  return newComment.save().then(commentInsert => {
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
    return Promise.reject(new Error('You may only edit your own comments.'))
  }
}

//"5c9bf7e3088cea6fa775c42a"
const CommentFields = {
  parent: obj => comment(obj, { id: obj.parentId }),
  replies,
  user: obj => user(obj, { id: obj.user._id }),
}

export default CommentFields
