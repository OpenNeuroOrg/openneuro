import React from 'react'
import PropTypes from 'prop-types'

export default class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: '',
    }
    this.handleChange = this._handleChange.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
  }

  _handleChange(e) {
    this.setState({ content: e.currentTarget.value })
  }

  _handleSubmit(parentId) {
    this.props.createComment(this.state.content, parentId)
    this.setState({ content: '' })
  }

  _newContent() {
    let submitText = this.props.parentId ? 'REPLY' : 'SUBMIT'
    let inputPlaceholderText = this.props.parentId
      ? 'Type your reply here...'
      : 'Type your comment here...'
    let replyIcon = this.props.parentId ? (
      <i className="fa fa-reply fa-rotate-180" />
    ) : null
    if (this.props.show) {
      return (
        <div className="reply-div">
          {replyIcon}
          <input
            className="comment-input"
            type="text"
            placeholder={inputPlaceholderText}
            value={this.state.content}
            onChange={this.handleChange}
          />
          <button
            className="comment-submit"
            onClick={this.handleSubmit.bind(this, this.props.parentId)}>
            {submitText}
          </button>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    return this._newContent()
  }
}

Comment.propTypes = {
  parentId: PropTypes.string,
  handleChange: PropTypes.func,
  createComment: PropTypes.func,
  show: PropTypes.bool,
}
