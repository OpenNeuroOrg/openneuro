import React from 'react'

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
