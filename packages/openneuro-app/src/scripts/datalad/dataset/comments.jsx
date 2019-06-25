import React from 'react'
import PropTypes from 'prop-types'
import Comment from './comment.jsx'
import CommentEditor from '../comments/comment-editor.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import LoggedOut from '../../authentication/logged-out.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'

const CommentTree = ({ datasetId, uploader, comments }) => (
  <>
    {comments.map(comment => {
      const nextLevel = comment.hasOwnProperty('replies') ? comment.replies : []
      return (
        <Comment
          key={comment.id}
          datasetId={datasetId}
          uploader={uploader}
          data={comment}>
          {nextLevel.length ? (
            <CommentTree
              datasetId={datasetId}
              uploader={uploader}
              comments={nextLevel}
            />
          ) : null}
        </Comment>
      )
    })}
  </>
)

CommentTree.propTypes = {
  datasetId: PropTypes.string,
  uploader: PropTypes.object,
  comments: PropTypes.array,
}

const Comments = ({ datasetId, uploader, comments }) => {
  return (
    <div className="col-xs-12">
      <div className="dataset-comments">
        <h2>Comments</h2>
        <ErrorBoundary>
          <LoggedIn>
            <CommentEditor datasetId={datasetId} />
          </LoggedIn>
          <LoggedOut>
            <div>Please sign in to contribute to the discussion.</div>
          </LoggedOut>
          <CommentTree
            datasetId={datasetId}
            uploader={uploader}
            comments={comments}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}

Comments.propTypes = {
  datasetId: PropTypes.string,
  uploader: PropTypes.object,
  comments: PropTypes.array,
}

export default Comments
