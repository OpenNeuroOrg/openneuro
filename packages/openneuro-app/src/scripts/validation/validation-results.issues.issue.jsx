// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ----------------------------------------------------

export default class Issue extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    const error = this.props.error
    let fileInfo
    // build error location string
    let errLocation = ''
    let errorLocationMeta
    if (error.line) {
      errLocation += 'Line: ' + error.line + ' '
    }
    if (error.character) {
      errLocation += 'Character: ' + error.character + ''
    }
    if (errLocation == '' && error.evidence) {
      errLocation = 'Evidence: '
    }
    if (errLocation) {
      errorLocationMeta = (
        <span className="e-meta">
          <label>{errLocation}</label>
          <p>{error.evidence}</p>
        </span>
      )
    }

    // Check if this issue has an file associated with it at all
    if (error.file) {
      fileInfo = (
        <span>
          {this._location(error.file)}
          {this._fileMetadata(error.file)}
        </span>
      )
    }

    return (
      <div className="em-body">
        {fileInfo}
        <span className="e-meta">
          <label>Reason: </label>
          <p>{error.reason}</p>
        </span>
        {errorLocationMeta}
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _location(file) {
    if (file && file.relativePath) {
      return (
        <span>
          <label>Location: </label>
          <p>{file.relativePath}</p>
        </span>
      )
    }
  }

  _fileMetadata(file) {
    if (file.size) {
      return (
        <span className="e-meta">
          <label>File Metadata:</label>
          <p>
            {file.size / 1000} KB | {file.type}
          </p>
        </span>
      )
    }
  }
}

Issue.propTypes = {
  file: PropTypes.object,
  error: PropTypes.object,
  type: PropTypes.string.isRequired,
}
