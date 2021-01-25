import React from 'react'
import PropTypes from 'prop-types'
import Comment from './comment.jsx'
import CommentEditor from '../comments/comment-editor.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import LoggedOut from '../../authentication/logged-out.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import { toast } from 'react-toastify'
import ToastContent from '../../common/partials/toast-content.jsx'

const CommentTree = ({ datasetId, uploader, comments, commentMap }) => (
  <>
    {comments.map(comment => {
      if (!comment) return null
      // Join any replies
      const nextLevel = comment.hasOwnProperty('replies')
        ? comment.replies.map(reply => commentMap[reply.id])
        : []
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
              commentMap={commentMap}
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
  commentMap: PropTypes.object,
}

const Comments = ({ datasetId, uploader, comments }) => {
  // Fast access map to dereference replies in CommentTree component
  const commentMap = Object.fromEntries(
    comments.map(comment => [comment.id, comment]),
  )
  // Get only top level comments
  const rootComments = comments.filter(comment => comment.parent === null)
  return (
    <div className="col-xs-12">
      <div className="dataset-comments">
        <h2>Comments</h2>
        <ErrorBoundary subject="error in dataset comments">
          <LoggedIn>
            <CommentEditor
              datasetId={datasetId}
              done={() =>
                toast.success(<ToastContent title="Comment Posted" />)
              }
            />
          </LoggedIn>
          <LoggedOut>
            <div>Please sign in to contribute to the discussion.</div>
          </LoggedOut>
          <CommentTree
            datasetId={datasetId}
            uploader={uploader}
            comments={rootComments}
            commentMap={commentMap}
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
