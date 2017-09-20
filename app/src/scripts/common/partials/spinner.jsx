// dependencies ------------------------------------------------------------------------------

import React from 'react'

// component setup ---------------------------------------------------------------------------

export default class Spinner extends React.Component {
  // life cycle events -------------------------------------------------------------------------

  render() {
    let spinner = (
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
  text: React.PropTypes.string,
  active: React.PropTypes.bool,
}

Spinner.defaultProps = {
  text: 'Loading',
  active: false,
}
