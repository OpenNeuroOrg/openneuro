// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import fileUtils from '../../utils/files'
import bowser from 'bowser'
import notifications from '../../notification/notification.actions'

class Upload extends React.Component {
  constructor() {
    super()
  }

  // life cycle events --------------------------------------------------
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
          onClick={this._click.bind(this)}
          onChange={this._onFileSelect.bind(this)}
          webkitdirectory="true"
          directory="true"
        />
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _click(e) {
    e.stopPropagation()
    e.target.value = null
    if (!bowser.chrome && !bowser.chromium && !bowser.firefox) {
      let chromeMessage = (
        <span>
          This is a Google Chrome and Mozilla Firefox feature.{' '}
          <a href="http://www.google.com/chrome/">
            Please consider using Chrome or Firefox as your browser
          </a>.
        </span>
      )
      e.preventDefault()
      notifications.createAlert({
        type: 'Error',
        message: chromeMessage,
      })
    }
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  _onFileSelect(e) {
    if (e.target && e.target.files.length > 0) {
      const files = e.target.files
      this.props.onChange({ files })
    }
  }

  _setRefs(refs) {
    if (this.props.setRefs) {
      this.props.setRefs(refs)
    }
  }
}

Upload.propTypes = {
  resume: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  setRefs: PropTypes.func,
}

export default Upload
