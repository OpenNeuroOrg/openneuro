// dependencies ------------------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ---------------------------------------------------------------------------

export default class Spinner extends React.Component {
  constructor(props) {
    super(props)
    this.state = { timedOut: false }
  }
  // life cycle events -------------------------------------------------------------------------
  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    if (!this.state.timedOut) {
      if (this.props.timeout) {
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ timedOut: true }, () => {
              this.forceUpdate()
            })
          }
        }, this.props.timeout)
      }
      let spinner = (
        <div className="loading-wrap fade-in">
          <div className="spinner">
            <div className="spinnerinner" />
          </div>
          <span>{this.props.text}</span>
        </div>
      )
      return this.props.active ? spinner : null
    } else {
      throw new Error(
        'The component has been loading for too long. Reverting render to component error boundary.',
      )
    }
  }
}

Spinner.propTypes = {
  text: PropTypes.string,
  active: PropTypes.bool,
  timeout: PropTypes.number,
}

Spinner.defaultProps = {
  text: 'Loading',
  active: false,
  timeout: null,
}
