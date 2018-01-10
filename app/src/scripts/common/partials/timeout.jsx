// dependencies ------------------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ---------------------------------------------------------------------------

export default class Timeout extends React.Component {
  constructor(props) {
    super(props)
    this.state = { timedOut: false }
  }
  // life cycle events -------------------------------------------------------------------------
  componentDidMount() {
    setTimeout(() => {
      this.setState({ timedOut: true })
    }, this.props.timeout)
  }

  componentWillUnmount() {
    clearTimeout()
  }

  render() {
    if (!this.state.timedOut) {
      return this.props.children
    } else {
      throw new Error(
        'The component has been loading for too long. Reverting render to component error boundary.',
      )
    }
  }
}

Timeout.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.object,
}

Timeout.defaultProps = {
  timeout: null,
}
