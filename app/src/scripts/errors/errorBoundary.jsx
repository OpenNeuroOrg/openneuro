import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Raven from 'raven-js'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: null, errorInfo: null, error: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, errorInfo: errorInfo, error: error })
    Raven.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={this.props.className}>
          <h3> {this.props.message}</h3>
        </div>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.object,
  message: PropTypes.string,
  className: PropTypes.string,
}

ErrorBoundary.defaultProps = {
  message:
    'An error has been caught within this component. Please intiialize the error boundary with a "message" property for a more specific message.',
}

export default ErrorBoundary
