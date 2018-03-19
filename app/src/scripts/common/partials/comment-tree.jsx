import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '../../user/avatar.jsx'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import Comment from './comment.jsx'
import WarnButton from '../forms/warn-button.jsx'
import Tooltip from '../partials/tooltip.jsx'
import { CopyToClipboard } from 'react-copy-to-clipboard'

class CommentTree extends React.Component {
  constructor(props) {
    super(props)

    let showSubtree = this.props.showSubtree ? this.props.showSubtree : true

    this.state = {
      showNewComment: false,
      showSubtree: showSubtree,
      editing: false,
      linkCopied: false,
    }
    this.handleDelete = this._handleDelete.bind(this)
    this.toggleNewComment = this._toggleNewComment.bind(this)
    this.toggleSubtree = this._toggleSubtree.bind(this)
    this.startEdit = this._startEdit.bind(this)
    this.cancelEdit = this._cancelEdit.bind(this)
    this.createComment = this._createComment.bind(this)
  }

  componentWillMount() {
    if (this.props.location.hash) {
      this.setState({ showSubtree: true })
    }
  }

  componentDidMount() {
    if (this.props.location.hash === `#comment-${this.props.node._id}`) {
      this.focusElement.focus()
    }
  }

  _handleDelete(commentId, parentId, callback) {
    this.props.deleteComment(commentId, parentId, callback)
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
    this.props.createComment(content, parentId)
    this.setState({ showNewComment: false, showSubtree: true })
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

  _onCopy() {
    this.setState({ linkCopied: true })
    setTimeout(() => {
      this.setState({ linkCopied: false })
    }, 3000)
  }

  _deleteButton(comment) {
    if (
      (comment.user.email === this.props.user.email || this.props.isAdmin) &&
      !this.props.node.deleted
    ) {
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
        <i className="fa fa-comment" />
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
            <i className="fa fa-pencil" />
            Edit
          </a>
        )
      } else {
        return (
          <a className="cancel-edit" onClick={this.cancelEdit.bind(this)}>
            <i className="fa fa-times" />
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
      let iconClass = this.state.showSubtree ? 'fa fa-minus' : 'fa fa-plus'
      return (
        <a className="toggle-replies" onClick={this.toggleSubtree.bind(this)}>
          <i className={iconClass} />
          {buttonText}
        </a>
      )
    } else {
      return null
    }
  }

  _ownerTag(ownerId) {
    if (
      this.props.uploadUser &&
      ownerId === this.props.uploadUser._id &&
      !this.props.node.deleted
    ) {
      return (
        <span>
          {' '}
          <span className="dataset-owner-flag"> Dataset Uploader</span> -{' '}
        </span>
      )
    }
    return null
  }

  _userTag(email) {
    if (this.props.node.deleted) {
      return <span className="username"> By [deleted] - </span>
    }
    return <span className="username"> By {email} - </span>
  }

  _userAvatar() {
    let comment = this.props.node
    if (!comment.deleted) {
      return (
        <div className="comment-avatar">
          <Avatar profile={comment.user} />
        </div>
      )
    } else {
      return <div className="comment-avatar" />
    }
  }

  _timestamp(createDate) {
    return (
      <span className="time-elapsed">
        {moment.duration(moment().diff(createDate)).humanize()} ago
      </span>
    )
  }

  _commentLink(comment) {
    return (
      <Tooltip tooltip="Click to save comment link to clipboard.">
        <CopyToClipboard
          text={`${window.location.origin}${
            this.props.location.pathname
          }#comment-${comment._id}`}
          onCopy={this._onCopy.bind(this)}>
          <a>
            <i className="fa fa-link" aria-hidden="true" />
          </a>
        </CopyToClipboard>
      </Tooltip>
    )
  }

  _copyNotification() {
    let copyClass = this.state.linkCopied
      ? 'copy-notification-active'
      : 'copy-notification'
    // let copyText = this.state.linkCopied ? 'Copied!' : ''
    return (
      <span className={copyClass}>
        {/* {copyText} */}
        Copied!
      </span>
    )
  }

  _actions(comment) {
    if ((this.props.user && !this.props.node.deleted) || this.props.isAdmin) {
      return (
        <div className="comment-actions">
          {this._deleteButton(comment)}
          {this._replyButton()}
          {this._editButton()}
          {this._newComment(comment._id)}
        </div>
      )
    }
    return null
  }

  _commentContent() {
    let comment = this.props.node
    if (comment.deleted) {
      return (
        <div className="comment-div">
          <div className="reply-div">
            <div className="deleted-comment">[deleted]</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="comment-div">
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
        </div>
      )
    }
  }

  _comment() {
    let comment = this.props.node
    return (
      <div
        className="comment"
        id={`comment-${comment._id}`}
        tabIndex="-1"
        ref={element => {
          this.focusElement = element
        }}>
        <div className="user-info">
          {this._userTag(comment.user.email)}
          {this._ownerTag(comment.user._id)}
          {this._timestamp(comment.createDate)}
          {this._commentLink(comment)}
          {this._copyNotification()}
          {this._showRepliesButton()}
        </div>
        {this._userAvatar()}
        {this._commentContent()}
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
          <CommentTreeWithRouter
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
    if (
      !this.props.node.children.length &&
      this.props.node.deleted &&
      !this.props.parentId &&
      !this.props.isAdmin
    ) {
      return null
    }
    return (
      <div className={parentClass}>
        {this._comment()}
        {this._childTree()}
      </div>
    )
  }
}

const CommentTreeWithRouter = withRouter(CommentTree)

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
  node: PropTypes.object,
  updateComment: PropTypes.func,
  location: PropTypes.object,
  parentId: PropTypes.string,
}

export default CommentTreeWithRouter
