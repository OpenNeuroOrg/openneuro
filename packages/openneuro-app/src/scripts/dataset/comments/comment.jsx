import React, { useState } from "react"
import { convertFromRaw, Editor, EditorState } from "draft-js"
import PropTypes from "prop-types"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import CommentEditor from "./comment-editor.jsx"
import DeleteComment from "../mutations/delete-comment.jsx"
import AdminUser from "../../authentication/admin-user.jsx"
import LoggedIn from "../../authentication/logged-in.jsx"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content"
import { Icon } from "@openneuro/components/icon"
import { Username } from "../../users/username"

const Comment = ({ datasetId, data, children }) => {
  const [replyMode, setReplyMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const parsedText = JSON.parse(data.text)
  const editorState = EditorState.createWithContent(convertFromRaw(parsedText))
  return (
    <>
      <div className="comment">
        <div className="row comment-header">
          By <Username user={data.user} />
          {` - ${formatDistanceToNow(parseISO(data.createDate))} ago`}
        </div>
        <div className="row comment-body">
          {editMode
            ? (
              <CommentEditor
                datasetId={datasetId}
                commentId={data.id}
                state={editorState}
                done={() => setEditMode(false)}
              />
            )
            : (
              <Editor
                editorKey={data.id}
                editorState={editorState}
                readOnly={true}
                onChange={() => {
                  /* Not editable, this shouldn't fire */
                }}
              />
            )}
        </div>
        <LoggedIn>
          <div className="row comment-controls grid grid-start">
            {editMode ? null : (
              <div className="col col-fixed">
                <a className="reply" onClick={() => setReplyMode(!replyMode)}>
                  {replyMode
                    ? <Icon icon="fa fa-times" label="Close" />
                    : <Icon icon="fa fa-comment" label="Reply" />}
                </a>
              </div>
            )}
            {replyMode ? null : (
              <div className="col col-fixed">
                <a className="edit" onClick={() => setEditMode(!editMode)}>
                  {editMode
                    ? <Icon icon="fa fa-times" label="Close" />
                    : <Icon icon="fa fa-edit" label="Edit" />}
                </a>
              </div>
            )}
            <AdminUser>
              <DeleteComment datasetId={datasetId} commentId={data.id} />
            </AdminUser>
          </div>
        </LoggedIn>
      </div>
      <div className="row replies">
        <div className="comment-reply">
          {replyMode
            ? (
              <CommentEditor
                datasetId={datasetId}
                parentId={data.id}
                done={() => {
                  setReplyMode(false)
                  toast.success(<ToastContent title="Reply Posted" />)
                }}
              />
            )
            : null}
        </div>
        {children}
      </div>
    </>
  )
}

Comment.propTypes = {
  datasetId: PropTypes.string,
  data: PropTypes.object,
  children: PropTypes.object,
}

export default Comment
