// dependencies ------------------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ---------------------------------------------------------------------------

export default class Spinner extends React.Component {
  // life cycle events -------------------------------------------------------------------------

  render() {
    const spinner = (
      <div className="loading-wrap fade-in">
        <div className="spinner">
          <div className="spinnerinner" />
        </div>
        <span>{this.props.text}</span>
      </div>
    )
    return this.props.active ? spinner : null
  }
}

Spinner.propTypes = {
  text: PropTypes.string,
  active: PropTypes.bool,
}

Spinner.defaultProps = {
  text: 'Loading',
  active: false,
}
