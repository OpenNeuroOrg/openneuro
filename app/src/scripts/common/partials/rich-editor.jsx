import React from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils } from 'draft-js'
import Prism from 'prismjs'
import '../../../assets/prism-language-loader'
import PrismDecorator from 'draft-js-prism'

export default class RichEditor extends React.Component {
  constructor(props) {
    super(props)

    let decorator = new PrismDecorator({
      prism: Prism,
      defaultSyntax: 'python',
    })

    this.state = {
      defaultSyntax: 'python',
      editorState: EditorState.createEmpty(decorator),
      decorator: decorator,
      placeholderText: this.props.placeholderText,
    }

    this.focus = () => this.editor.focus()
    this.onChange = this._onChange.bind(this)

    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.onTab = this._onTab.bind(this)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
    this.changeLanguage = this._changeLanguage.bind(this)
  }

  _onChange(editorState) {
    let decorator = this.state.decorator
    console.log('editorState', editorState)
    this.setState({
      editorState: EditorState.set(editorState, { decorator }),
    })
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
    let decorator = new PrismDecorator({
      prism: Prism,
      defaultSyntax: value,
    })
    this.setState({ decorator: decorator }, () => {
      this.onChange(this.state.editorState)
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

  _onSave() {
    console.log()
  }

  render() {
    const { editorState } = this.state

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

    return (
      <div>
        <div className="RichEditor-root">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <SyntaxLanguageSelector changeLanguage={this.changeLanguage} />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <div className={className}>
            <Editor
              blockStyleFn={getBlockStyle}
              syntax="python"
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              onTab={this.onTab}
              placeholder={this.state.placeholderText}
              ref={ref => (this.editor = ref)}
              spellCheck={true}
            />
          </div>
        </div>
        <div />
      </div>
    )
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
      <select onChange={props.changeLanguage}>
        <option value="python" defaultValue>
          Python
        </option>
        <option value="javascript">JS</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
      </select>
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

RichEditor.propTypes = {
  placeholderText: PropTypes.string,
}
