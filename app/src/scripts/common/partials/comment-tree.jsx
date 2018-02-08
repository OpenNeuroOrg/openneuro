import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import moment from 'moment'
import Comment from './comment.jsx'
import WarnButton from '../forms/warn-button.jsx'

export default class CommentTree extends Reflux.Component {
  constructor(props) {
    super(props)

    let showSubtree = this.props.showSubtree ? this.props.showSubtree : false

    this.state = {
      showNewComment: false,
      showSubtree: showSubtree,
      editing: false,
    }
    this.handleDelete = this._handleDelete.bind(this)
    this.toggleNewComment = this._toggleNewComment.bind(this)
    this.toggleSubtree = this._toggleSubtree.bind(this)
    this.startEdit = this._startEdit.bind(this)
    this.cancelEdit = this._cancelEdit.bind(this)
    this.createComment = this._createComment.bind(this)
  }

  _handleDelete(commentId, parentId) {
    this.props.deleteComment(commentId, parentId)
  }

  _newComment(parentId) {
    return (
      <Comment
        parentId={parentId}
        createComment={this.createComment}
        show={this.state.showNewComment}
        editing={true}
        new={true}
      />
    )
  }

  _createComment(content, parentId) {
    if (this.editorState.getCurrentContent.hasText()) {
      this.props.createComment(content, parentId)
      this.setState({ showNewComment: false, showSubtree: true })
    }
  }

  _toggleNewComment() {
    let showNewComment = !this.state.showNewComment
    this.setState({ showNewComment: showNewComment })
  }

  _toggleSubtree() {
    let showSubtree = !this.state.showSubtree
    this.setState({ showSubtree: showSubtree })
  }

  _startEdit() {
    this.setState({ editing: true })
  }

  _cancelEdit() {
    this.setState({ editing: false })
  }

  _deleteButton(comment) {
    if (comment.user.email === this.props.user.email || this.props.isAdmin) {
      return (
        <WarnButton
          action={this.handleDelete.bind(
            this,
            comment._id,
            this.props.parentId,
          )}
          message="Delete"
          icon="fa-trash"
        />
      )
    }
    return null
  }

  _replyButton() {
    let replyText = this.state.showNewComment ? 'Hide Reply' : 'Reply'
    return (
      <a className="reply" onClick={this.toggleNewComment.bind(this)}>
        {replyText}
      </a>
    )
  }

  _editButton() {
    let comment = this.props.node
    if (comment.user.email === this.props.user.email || this.props.isAdmin) {
      if (!this.state.editing) {
        return (
          <a className="edit" onClick={this.startEdit.bind(this)}>
            Edit
          </a>
        )
      } else {
        return (
          <a className="cancel-edit" onClick={this.cancelEdit.bind(this)}>
            Cancel Edit
          </a>
        )
      }
    }
    return null
  }

  _showRepliesButton() {
    let repliesExist = this.props.node.children
      ? this.props.node.children.length
      : false
    if (repliesExist) {
      let buttonText = this.state.showSubtree ? 'Hide Replies' : 'Show Replies'
      return (
        <a className="toggle-replies" onClick={this.toggleSubtree.bind(this)}>
          {buttonText}
        </a>
      )
    } else {
      return null
    }
  }

  _ownerTag(ownerEmail) {
    if (
      this.props.user &&
      this.props.uploadUser &&
      ownerEmail === this.props.user._id
    ) {
      return (
        <span>
          {' '}
          <span className="dataset-owner-flag"> Owner</span> -{' '}
        </span>
      )
    }
    return null
  }

  _userTag(email) {
    return <span className="username"> By {email} - </span>
  }

  _timestamp(createDate) {
    return (
      <span className="time-elapsed">
        {moment.duration(moment().diff(createDate)).humanize()} ago
      </span>
    )
  }

  _actions(comment) {
    if (this.props.user) {
      return (
        <div className="comment-actions">
          {this._showRepliesButton()}
          {this._deleteButton(comment)}
          {this._replyButton()}
          {this._editButton()}
          {this._newComment(comment._id)}
        </div>
      )
    }
    return null
  }

  _comment() {
    let comment = this.props.node
    return (
      <div className="comment">
        <div className="user-info">
          {this._userTag(comment.user.email)}
          {this._ownerTag(comment.user.email)}
          {this._timestamp(comment.createDate)}
        </div>
        <div className="comment-avatar">
          <img src={comment.user.imageUrl} />
        </div>
        <div className="comment-div">
          <span className="comment-text">
            <Comment
              editing={this.state.editing}
              new={false}
              show={true}
              content={comment.text}
              commentId={comment._id}
              updateComment={this.props.updateComment}
              startEdit={this.startEdit.bind(this)}
              cancelEdit={this.cancelEdit.bind(this)}
            />
          </span>
        </div>
        {this._actions(comment)}
      </div>
    )
  }

  _childTree() {
    let childTree = this.props.node.children.length
      ? this.props.node.children
      : null
    let content = []
    if (childTree && this.state.showSubtree) {
      for (let childNode of childTree) {
        content.push(
          <CommentTree
            key={childNode._id}
            uploadUser={this.props.uploadUser}
            user={this.props.user}
            isAdmin={this.props.isAdmin}
            node={childNode}
            parentId={this.props.node._id}
            createComment={this.props.createComment}
            deleteComment={this.props.deleteComment}
            updateComment={this.props.updateComment}
          />,
        )
      }
      return content
    } else {
      return null
    }
  }

  render() {
    let parentClass = this.props.isParent
      ? 'comment-tree parent-comment'
      : 'comment-tree'
    return (
      <div className={parentClass}>
        {this._comment()}
        {this._childTree()}
      </div>
    )
  }
}

CommentTree.propTypes = {
  datasetId: PropTypes.string,
  uploadUser: PropTypes.object,
  user: PropTypes.object,
  isParent: PropTypes.bool,
  deleteComment: PropTypes.func,
  createComment: PropTypes.func,
  commentTree: PropTypes.array,
  isAdmin: PropTypes.bool,
  showSubtree: PropTypes.bool,
}
