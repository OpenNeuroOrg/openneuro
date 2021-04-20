import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface CommentDocument extends Document {
  createDate: Date
  datasetId: string
  datasetLabel: string
  user: {
    _id: string
  }
  parentId: string
  text: string
}

const commentSchema = new Schema(
  {
    createDate: { type: Date, default: Date.now },
    datasetId: String,
    datasetLabel: String, // TODO - Remove this?
    user: { _id: String },
    parentId: String,
    text: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

// Foreign key virtuals
commentSchema.virtual('poster', {
  ref: 'User',
  localField: 'user._id',
  foreignField: 'id',
  justOne: true,
})

// Foreign key virtuals
commentSchema.virtual('parent', {
  ref: 'Comment',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
})

const Comment = model<CommentDocument>('Comment', commentSchema)

export default Comment
