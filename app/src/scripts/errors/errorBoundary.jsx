import React, { Component } from 'react'
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
        <div>
          <h1> {this.props.message}</h1>
        </div>
      )
    }
    //console.log('error boundary children:', this.props.children)
    return this.props.children
  }
}

export default ErrorBoundary
