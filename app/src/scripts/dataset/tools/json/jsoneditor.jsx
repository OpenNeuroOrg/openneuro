import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import actions from './jsoneditor.actions.js'
import JsonEditorStore from './jsoneditor.store.js'
import { refluxConnect } from '../../../utils/reflux'

export default class JsonEditor extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, JsonEditorStore, 'json')

    this.widgets = {
      edit: this.editWidget.bind(this),
      save: this.saveWidget.bind(this),
      cancel: this.cancelWidget.bind(this),
      error: this.errorWidget.bind(this),
      errorDetail: this.errorDetailWidget.bind(this),
    }

    this._headerBar = this.headerBar.bind(this)
    this._onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount() {
    let data = {
      isSnapshot: this.props.isSnapshot,
      onSave: this.props.onSave,
      originalData: this.props.data,
      originalFile: this.props.file.info,
      editing: false,
      editable: !this.props.isSnapshot,
    }
    actions.setInitialState(data)
    actions.setJsonContent(this.props.data)
  }

  async onKeyDown(e) {
    // check for tab pressed, turn into four spaces:
    if (e.keyCode === 9) {
      e.preventDefault()
      let originalText = this.state.json.data
      let startIdx = e.target.selectionStart
      let endIdx = e.target.selectionEnd
      let data =
        originalText.substring(0, startIdx) +
        '\t' +
        originalText.substring(endIdx)
      await actions.update({ data: data })
      this.refs.text.selectionStart = startIdx + 1
      this.refs.text.selectionEnd = startIdx + 1
      this.forceUpdate()
    }
  }

  editWidget() {
    if (!this.state.json.editing && this.state.json.editable) {
      return (
        <span>
          <a title="edit json" onClick={actions.startEdit}>
            <i className="fa fa-pencil" />
            EDIT FILE
          </a>
        </span>
      )
    }
  }

  cancelWidget() {
    if (this.state.json.editing && this.state.json.editable) {
      return (
        <span>
          <a title="cancel edit" onClick={actions.cancelEdit}>
            <i className="fa fa-times" />
            CANCEL EDIT
          </a>
        </span>
      )
    }
  }

  saveWidget() {
    if (this.state.json.editing && this.state.json.editable) {
      return (
        <span>
          <a title="save json" onClick={actions.saveFile}>
            <i className="fa fa-check" />
            SAVE CHANGES
          </a>
        </span>
      )
    }
  }

  errorWidget() {
    if (
      this.state.json.editing &&
      this.state.json.editable &&
      this.state.json.errorMessage
    ) {
      let infoClass = this.state.json.showErrorDetail
        ? 'fa fa-minus'
        : 'fa fa-plus'
      return (
        <span>
          <span title="error message" className="text-danger">
            {this.state.json.errorMessage}
          </span>
          <span
            title="error detail"
            className="text-danger"
            onClick={actions.toggleInfoDiv}>
            <i className={infoClass} />
          </span>
        </span>
      )
    }
  }

  errorDetailWidget() {
    if (
      this.state.json.editing &&
      this.state.json.editable &&
      this.state.json.showErrorDetail
    ) {
      let errorDetails = []
      for (let detail of this.state.json.errorDetail) {
        const key = this.state.json.errorDetail.indexOf(detail)
        errorDetails.push(
          <div key={key}>
            <span className="text-danger">{detail}</span>
          </div>,
        )
      }
      return <div className="json-error-detail">{errorDetails}</div>
    }
  }

  headerBar() {
    return (
      <div className="json-editor-controls">
        {this.widgets.edit()}
        {this.widgets.cancel()}
        {this.widgets.save()}
        {this.widgets.error()}
        {this.widgets.errorDetail()}
      </div>
    )
  }

  render() {
    if (this.state.json.editing) {
      return (
        <div className="json-editor">
          {this._headerBar()}
          <textarea
            value={this.state.json.data}
            ref="text"
            onChange={actions.onChange}
            onKeyDown={this._onKeyDown}
          />
        </div>
      )
    } else {
      return (
        <div className="json-editor">
          {this._headerBar()}
          {this.state.json.data}
        </div>
      )
    }
  }
}

JsonEditor.propTypes = {
  isSnapshot: PropTypes.bool,
  onSave: PropTypes.func,
  data: PropTypes.string,
  file: PropTypes.object,
}
