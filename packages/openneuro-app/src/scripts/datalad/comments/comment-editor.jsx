import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils } from 'draft-js'
import CommentMutation from '../mutations/comment.jsx'
import BlockStyleControls from './block-style-controls.jsx'
import InlineStyleControls from './inline-style-controls.jsx'

const getBlockStyle = block =>
  block.getType() === 'blockquote' ? 'RichEditor-blockquote' : null

const CommentEditor = ({
  datasetId,
  parentId = null,
  commentId = null,
  state = null,
  done,
}) => {
  const [editorState, setEditorState] = useState(
    state || EditorState.createEmpty(),
  )
  const disabled = editorState.getUndoStack().size === 0
  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={blockType =>
          setEditorState(RichUtils.toggleBlockType(editorState, blockType))
        }
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={inlineStyle =>
          setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
        }
      />
      <div className="RichEditor-editor">
        <Editor
          editorKey={commentId}
          blockStyleFn={getBlockStyle}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Type your comment here..."
          spellCheck
        />
        {commentId ? (
          <CommentMutation
            datasetId={datasetId}
            commentId={commentId}
            comment={editorState.getCurrentContent()}
            disabled={disabled}
            done={done}
          />
        ) : (
          <CommentMutation
            datasetId={datasetId}
            parentId={parentId}
            comment={editorState.getCurrentContent()}
            disabled={disabled}
            done={done}
          />
        )}
      </div>
    </div>
  )
}

CommentEditor.propTypes = {
  datasetId: PropTypes.string,
  parentId: PropTypes.string,
  commentId: PropTypes.string,
  state: PropTypes.object,
  done: PropTypes.func,
}

export default CommentEditor
