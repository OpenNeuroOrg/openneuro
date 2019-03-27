import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js'
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
          spellCheck={true}
        />
        <CommentMutation
          datasetId={datasetId}
          parentId={parentId}
          comment={JSON.stringify(
            convertToRaw(editorState.getCurrentContent()),
          )}
        />
      </div>
    </div>
  )
}

export default CommentEditor
