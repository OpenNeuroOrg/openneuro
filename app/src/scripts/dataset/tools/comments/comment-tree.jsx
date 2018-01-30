import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import actions from './comments.actions.js'
import commentStore from './comments.store.js'
import Comment from './comment.jsx'
import { refluxConnect } from '../../../utils/reflux'

export default class CommentTree extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, commentStore, 'comments')
  }

  componentDidMount() {
    let data = {
      datasetId: this.props.datasetId,
      userId: this.props.user._id,
    }

    actions.setInitialState(data)
    actions.loadComments(this.props.datasetId)
  }

  render() {
    return (
      <div>
        <div className="comment-tree">{this._commentTree()}</div>
        <div className="comment-box">{this._newComment()}</div>
      </div>
    )
  }

  _newComment() {
    return <Comment parentId={this.props.parentId} />
  }

  _commentTree() {
    let comments = []
    for (let comment of this.state.comments.comments) {
      const key = 'comment_' + this.state.comments.comments.indexOf(comment)
      comments.push(
        <div key={key}>
          <div className="comment-text">{comment.text}</div>
          <div className="comment-actions">
            <a className="reply">Reply</a>
            <a className="delete">Delete</a>
          </div>
        </div>,
      )
    }
    if (this.state.comments.comments.length === 0) {
      comments.push(
        <div key={'comment_0'} className="no-comment">
          There are no comments for this dataset. Be the first to comment!
        </div>,
      )
    }
    return (
      <div className="comments">
        <div className="comment-header">COMMENTS</div>
        {comments}
      </div>
    )
  }
}

CommentTree.PropTypes = {
  datasetId: PropTypes.number,
  userId: PropTypes.number,
}
