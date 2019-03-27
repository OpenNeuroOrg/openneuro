import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils } from 'draft-js'
import CommentMutation from '../mutations/comment.jsx'
import BlockStyleControls from './block-style-controls.jsx'
import InlineStyleControls from './inline-style-controls.jsx'

const getBlockStyle = block =>
  block.getType() === 'blockquote' ? 'RichEditor-blockquote' : null

const CommentEditor = ({ datasetId, parentId = null }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
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
          blockStyleFn={getBlockStyle}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Type your comment here..."
          spellCheck={true}
        />
        <CommentMutation
          datasetId={datasetId}
          parentId={parentId}
          comment={editorState.getCurrentContent()}
          disabled={editorState.getUndoStack().size === 0}
        />
      </div>
    </div>
  )
}

export default CommentEditor
