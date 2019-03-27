import React, { useState } from 'react'
import PropTypes from 'prop-types'
import userUtil from '../../utils/user.js'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import CommentEditor from '../comments/comment-editor.jsx'

const Comment = ({ datasetId, uploader, data, children }) => {
  const [replyMode, setReplyMode] = useState(false)
  const parsedText = JSON.parse(data.text)
  const editorState = EditorState.createWithContent(convertFromRaw(parsedText))
  return (
    <>
      <div className="row">
        {`By ${data.user.email} - ${distanceInWordsToNow(data.createDate)} ago`}
      </div>
      <div className="row">
        <div className="col-xs-1">
          <img
            src={userUtil.generateGravatarUrl(data.user)}
            width={60}
            height={60}
          />
        </div>
        <div className="col-xs-11">
          <Editor editorState={editorState} />
          <a className="reply" onClick={() => setReplyMode(!replyMode)}>
            <i className="fa fa-comment" />
            {replyMode ? 'Hide' : 'Reply'}
          </a>
          {replyMode ? (
            <CommentEditor datasetId={datasetId} parentId={data.id} />
          ) : null}
        </div>
      </div>
      <div className="row replies">{children}</div>
    </>
  )
}

export default Comment
