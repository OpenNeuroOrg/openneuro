import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import commentStore from './comments.store.js'
import actions from './comments.actions.js'
import { refluxConnect } from '../../../utils/reflux'

export default class Comment extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, commentStore, 'comment')
    this.handleChange = this._handleChange.bind(this)
  }

  componentDidMount() {}

  _handleChange(e) {
    actions.update({ content: e.currentTarget.value })
  }

  render() {
    return (
      <div className="comment-input">
        <input
          type="text"
          placeholder="Type your comment here..."
          value={this.state.comment.content}
          onChange={this.handleChange}
        />
        <button
          className="submit"
          onClick={actions.createComment.bind(
            this,
            this.state.comment.content,
            this.props.parentId,
          )}>
          SUBMIT
        </button>
      </div>
    )
  }
}

Comment.propTypes = {}
