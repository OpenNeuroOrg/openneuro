// dependencies ------------------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ---------------------------------------------------------------------------

export default class Wrapper extends React.Component {
  // life cycle events -------------------------------------------------------------------------

  render() {
    return this.props.children
  }
}

Wrapper.propTypes = {
  children: PropTypes.object,
}
