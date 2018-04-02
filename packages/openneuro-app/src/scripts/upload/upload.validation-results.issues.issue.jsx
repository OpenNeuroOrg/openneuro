// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ----------------------------------------------------

export default class Issue extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    let error = this.props.error
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
          {this._fileName(error.file)}
          {this._fileMetadata(error.file)}
        </span>
      )
    }

    return (
      <div className="em-body">
        {fileInfo}
        <span className="e-meta">
          {this._location(error.file)}
          <label>Reason: </label>
          <p>{error.reason}</p>
        </span>
        {errorLocationMeta}
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _fileName(file) {
    let fileName = file.name
      ? file.name
      : file.relativePath.split('/')[file.relativePath.split('/').length - 1]
    if (fileName) {
      return (
        <span className="e-meta">
          <label>File Name:</label>
          <p>{fileName}</p>
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

  _location(file) {
    if (file && file.webkitRelativePath) {
      return (
        <span>
          <label>Location: </label>
          <p>{file.webkitRelativePath}</p>
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
