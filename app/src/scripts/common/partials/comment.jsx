import React from 'react'
import PropTypes from 'prop-types'
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import Prism from 'prismjs'
import '../../../assets/prism-language-loader'
import PrismDecorator from 'draft-js-prism'

export default class Comment extends React.Component {
  constructor(props) {
    super(props)

    this.focus = () => this.editor.focus()
    this.onChange = this._onChange.bind(this)
    this.onSubmit = this._onSubmit.bind(this)
    this.onUpdate = this._onUpdate.bind(this)

    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.onTab = this._onTab.bind(this)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
    this.changeLanguage = this._changeLanguage.bind(this)
    this.newContent = this._newContent.bind(this)
    this.existingContent = this._existingContent.bind(this)
    this.getDecorator = this._getDecorator.bind(this)

    let decorator = this.getDecorator('python')

    this.state = {
      defaultSyntax: 'python',
      editorState: EditorState.createEmpty(decorator),
      originalEditorState: EditorState.createEmpty(decorator),
      decorator: decorator,
      placeholderText: this.props.placeholderText,
      editing: this.props.editing,
      new: this.props.new,
    }
  }

  componentDidMount() {
    // load existing comment editorState + decorator
    if (!this.state.new && this.props.content) {
      let content = JSON.parse(this.props.content)
      let codeLanguage = content.codeLanguage
      let decorator = this.getDecorator(codeLanguage)
      let contentState = convertFromRaw(content)
      let editorState = EditorState.createWithContent(contentState)
      this.setState(
        { decorator: decorator, originalEditorState: editorState },
        () => {
          this.onChange(editorState)
        },
      )
    }
  }

  componentWillReceiveProps(newProps) {
    // revert comment state to orignalEditorState on cancel edit
    if (newProps.editing !== this.props.editing) {
      if (!newProps.editing) {
        this.onChange(this.state.originalEditorState)
      }
      this.setState({
        editing: newProps.editing,
      })
    }
  }

  _onChange(editorState) {
    let decorator = this.state.decorator
    this.setState({
      editorState: EditorState.set(editorState, { decorator }),
    })
  }

  _onSubmit(parentId) {
    let content = convertToRaw(this.state.editorState.getCurrentContent())
    content.codeLanguage = this.state.decorator.options.defaultSyntax
    let stringContent = JSON.stringify(content)
    this.props.createComment(stringContent, parentId)
    let emptyEditorState = EditorState.createEmpty()
    this.onChange(emptyEditorState)
    this.setState({
      editing: false,
    })
  }

  _onUpdate() {
    let content = convertToRaw(this.state.editorState.getCurrentContent())
    content.codeLanguage = this.state.decorator.options.defaultSyntax
    let stringContent = JSON.stringify(content)
    this.props.updateComment(this.props.commentId, stringContent)
    this.setState(
      {
        originalEditorState: this.state.editorState,
      },
      () => {
        this.props.cancelEdit()
      },
    )
  }

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  _onTab(e) {
    const maxDepth = 4
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  _getSyntax() {
    return this.state.codeSyntax
  }

  _changeLanguage(e) {
    let value = e.currentTarget.value
    let decorator = this.getDecorator(value)
    this.setState({ decorator: decorator }, () => {
      this.onChange(this.state.editorState)
    })
  }

  _getDecorator(syntax) {
    return new PrismDecorator({
      prism: Prism,
      defaultSyntax: syntax,
    })
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle),
    )
  }

  _newContent() {
    const { editorState } = this.state

    let className = 'RichEditor-editor'
    var contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder'
      }
    }

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
          <div>
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <SyntaxLanguageSelector changeLanguage={this.changeLanguage} />
              <div className={className}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  syntax="python"
                  customStyleMap={styleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  onTab={this.onTab}
                  placeholder={inputPlaceholderText}
                  ref={ref => (this.editor = ref)}
                  spellCheck={true}
                />
              </div>
            </div>
          </div>
          <button
            className="comment-submit btn btn-md btn-primary"
            onClick={this.onSubmit.bind(this, this.props.parentId)}>
            {submitText}
          </button>
        </div>
      )
    } else {
      return null
    }
  }

  _existingContent() {
    const { editorState } = this.state

    console.log(
      'rendering existing content with the following editing state:',
      this.props.editing,
    )

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    var contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder'
      }
    }
    let inputPlaceholderText = this.props.parentId
      ? 'Type your reply here...'
      : 'Type your comment here...'
    let replyIcon = this.props.parentId ? (
      <i className="fa fa-reply fa-rotate-180" />
    ) : null
    let controls
    let submitButton
    if (this.state.editing) {
      controls = (
        <div className="comment-controls">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <SyntaxLanguageSelector changeLanguage={this.changeLanguage} />
        </div>
      )

      submitButton = (
        <button
          className="comment-submit btn btn-md btn-primary"
          onClick={this.onUpdate.bind(this)}>
          SAVE CHANGES
        </button>
      )
    }
    return (
      <div className="reply-div">
        {replyIcon}
        <div>
          <div className="RichEditor-root">
            {controls}
            <div className={className}>
              <Editor
                blockStyleFn={getBlockStyle}
                syntax={this.state.decorator.defaultSyntax}
                customStyleMap={styleMap}
                editorState={editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
                onTab={this.onTab}
                placeholder={inputPlaceholderText}
                readOnly={!this.state.editing}
                ref={ref => (this.editor = ref)}
                spellCheck={true}
              />
            </div>
          </div>
        </div>
        {submitButton}
      </div>
    )
  }

  render() {
    if (this.state.new) {
      return this.newContent()
    } else {
      return this.existingContent()
    }
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

class StyleButton extends React.Component {
  constructor() {
    super()
    this.onToggle = e => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render() {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
]

const BlockStyleControls = props => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

const SyntaxLanguageSelector = props => {
  return (
    <div>
      <div className="form-group row">
        <label>Syntax Highlighting Language:</label>
        <div className="form-control-plaintext">
          <select onChange={props.changeLanguage} className="language-selector">
            <option value="python" defaultValue>
              Python
            </option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
    </div>
  )
}

var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
]

const InlineStyleControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

SyntaxLanguageSelector.propTypes = {
  changeLanguage: PropTypes.func,
}

InlineStyleControls.propTypes = {
  editorState: PropTypes.object,
  onToggle: PropTypes.func,
}

BlockStyleControls.propTypes = {
  editorState: PropTypes.object,
  onToggle: PropTypes.func,
}

StyleButton.propTypes = {
  style: PropTypes.string,
  onToggle: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.string,
}

Comment.propTypes = {
  parentId: PropTypes.string,
  handleChange: PropTypes.func,
  createComment: PropTypes.func,
  updateComment: PropTypes.func,
  cancelEdit: PropTypes.func,
  commentId: PropTypes.string,
  show: PropTypes.bool,
  editing: PropTypes.bool,
  new: PropTypes.bool,
  placeholderText: PropTypes.string,
  content: PropTypes.string,
}
