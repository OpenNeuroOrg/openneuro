// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

export default class FileTree extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    let tree = this.props.tree ? this.props.tree : []
    let nodes = tree.map((item, index) => {
      return (
        <li key={index}>
          {item.name}
          <ul>
            <FileTree tree={item.children} />
          </ul>
        </li>
      )
    })
    return <ul>{nodes}</ul>
  }
}

FileTree.propTypes = {
  tree: PropTypes.array,
}
