// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import fileUtils from '../../utils/files'
import bowser from 'bowser'
import notifications from '../../notification/notification.actions'
import UploadStore from '../../upload/upload.store.js'

let Upload = React.createClass({
  mixins: [Reflux.connect(UploadStore)],

  // life cycle events --------------------------------------------------

  componentDidMount() {
    this.refs.fileSelect.setAttribute('webkitdirectory', true)
    this.refs.fileSelect.setAttribute('directory', true)
    this._setRefs(this.refs)
  },

  propTypes: {
    resume: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onChange: React.PropTypes.func,
    setRefs: React.PropTypes.func,
  },

  render() {
    let resumeIcon = (
      <span>
        <i className="fa fa-repeat" />&nbsp;
      </span>
    )
    let icon = this.props.resume ? resumeIcon : null
    let text = this.props.resume ? 'Resume' : 'Select folder'

    return (
      <div className="fileupload-btn">
        <span>
          {icon}
          {text}
        </span>
        <input
          type="file"
          id="multifile-select"
          className="multifile-select-btn"
          onClick={this._click}
          onChange={this._onFileSelect}
          ref="fileSelect"
        />
      </div>
    )
  },

  // custom methods -----------------------------------------------------

  _click(e) {
    this.refs.fileSelect.value = null
    e.stopPropagation()
    if (!bowser.chrome && !bowser.chromium) {
      let chromeMessage = (
        <span>
          This is a Google Chrome only feature.{' '}
          <a href="http://www.google.com/chrome/">
            Please consider using Chrome as your browser
          </a>.
        </span>
      )
      e.preventDefault()
      notifications.createAlert({
        type: 'Error',
        message: chromeMessage,
      })
    }
    if (this.state.uploadStatus === 'uploading') {
      e.preventDefault()
      notifications.createAlert({
        type: 'Warning',
        message:
          'You may only upload one dataset at a time. Please wait for the current upload to finish, then try resuming again.',
      })
    }
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  },

  _onFileSelect(e) {
    if (e.target && e.target.files.length > 0) {
      let files = e.target.files
      let dirTree = fileUtils.generateTree(files)
      let results = { tree: dirTree, list: files }
      this.props.onChange(results)
    }
  },

  _setRefs(refs) {
    if (this.props.setRefs) {
      this.props.setRefs(refs)
    }
  },
})

export default Upload
