import React from 'react'
import PropTypes from 'prop-types'

export default class FileTreeGeneric extends React.Component {
  constructor() {
    super()
  }

  render() {
    return this.props.files ? (
      <ul>
        {this.props.files.map(file => <li key={file.id}>{file.filename}</li>)}
      </ul>
    ) : null
  }
}

FileTreeGeneric.propTypes = {
  files: PropTypes.array,
}
