// dependencies -------------------------------------------------------

import React from 'react'

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
  tree: React.PropTypes.array,
}
