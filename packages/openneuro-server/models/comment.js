import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
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

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
