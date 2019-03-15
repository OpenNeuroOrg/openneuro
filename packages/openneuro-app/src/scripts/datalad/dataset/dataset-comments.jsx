import React from 'react'
import Comment from '../../common/partials/comment.jsx'
import CommentTree from '../../common/partials/comment-tree.jsx'

const DatasetComments = ({ uploader, comments }) => (
  <div className="col-xs-12 dataset-inner">
    <hr />
    {JSON.stringify(comments)}
  </div>
)

export default DatasetComments
