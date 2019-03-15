import Comment from '../../models/comment'
import { user } from './user.js'

export const comment = (obj, { id }) => {
  return Comment.findOne({ _id: id }).exec()
}

export const datasetComments = obj => {
  return Comment.find({ datasetId: obj.id, parentId: null }).exec()
}

export const userComments = obj => {
  return Comment.find({ 'user._id': obj.id }).exec()
}

const replies = obj => {
  return Comment.find({ parentId: obj._id }).exec()
}

const CommentFields = {
  parent: obj => comment(obj, { id: obj.parentId }),
  replies,
  user: obj => user(obj, { id: obj.user._id }),
}

export default CommentFields
