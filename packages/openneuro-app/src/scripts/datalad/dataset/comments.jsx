import React from 'react'
import Comment from './comment.jsx'
import CommentEditor from '../comments/comment-editor.jsx'

const CommentTree = ({ datasetId, uploader, comments }) => (
  <>
    {comments.map(comment => (
      <Comment
        key={comment.id}
        datasetId={datasetId}
        uploader={uploader}
        data={comment}>
        {comments ? (
          <CommentTree
            datasetId={datasetId}
            uploader={uploader}
            comments={comment.replies}
          />
        ) : null}
      </Comment>
    ))}
  </>
)

const Comments = ({ datasetId, uploader, comments }) => {
  return (
    <div className="col-xs-12 dataset-inner">
      <hr />
      <div className="dataset-comments">
        <h2>Comments</h2>
        <CommentEditor datasetId={datasetId} />
        <CommentTree
          datasetId={datasetId}
          uploader={uploader}
          comments={comments}
        />
      </div>
    </div>
  )
}

export default Comments
