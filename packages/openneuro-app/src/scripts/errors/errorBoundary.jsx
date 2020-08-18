import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import FreshdeskInterface from './freshdeskInterface.jsx'

// raises error if catchErrorIf returns true
const getDerivedStateFromErrorOnCondition = (error, catchErrorIf) => {
  const raiseError =
    typeof catchErrorIf === 'function' ? catchErrorIf(error) : true
  return raiseError
    ? // trigger error component
      { hasError: true, supportModal: false, error: error }
    : // don't show error handling component
      { hasError: false, supportModal: false, error: error }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      eventId: null,
      message: '',
    }
  }

  static getDerivedStateFromError(error) {
    return getDerivedStateFromErrorOnCondition(
      error,
      // error boundary should always be triggered in general case
      () => true,
    )
  }

  componentDidCatch(error, { componentStack }) {
    const message = String(error)
    error.componentStack = componentStack

    Sentry.withScope(scope => {
      scope.setTag('datasetId', this.props.datasetId)
      this.setState({
        eventId: Sentry.captureException(error),
        message,
      })
    })
  }

  render() {
    const { error, message } = this.state

    const { subject, description } = this.props
    if (error) {
      return (
        <FreshdeskInterface
          message={message}
          error={error}
          subject={subject}
          description={description}
          eventId={this.state.eventId}
        />
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  errorMessage: PropTypes.string,
  datasetId: PropTypes.string,
  subject: PropTypes.string,
  description: PropTypes.string,
}

// specific use case
// ignore error in apollo lib
class ErrorBoundaryAssertionFailureException extends ErrorBoundary {
  constructor(props) {
    super(props)
  }

  static getDerivedStateFromError(error) {
    return getDerivedStateFromErrorOnCondition(
      error,
      // ErrorBoundary not triggered for "assertion failure"
      error => error.toString() !== 'Error: assertion failure',
    )
  }
}

// specific use case
// ignore error in apollo lib
class ErrorBoundaryDeletePageException extends ErrorBoundary {
  constructor(props) {
    super(props)
  }

  static getDerivedStateFromError(error) {
    return getDerivedStateFromErrorOnCondition(
      error,
      // ErrorBoundary not triggered for "assertion failure"
      () => {
        const throwError = !/^\/datasets\/ds\d{6}\/delete$/.test(
          window.location.pathname,
        )
        console.log(throwError)
        return throwError
      },
    )
  }
}

ErrorBoundaryAssertionFailureException.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  errorMessage: PropTypes.string,
}

export {
  ErrorBoundaryAssertionFailureException,
  ErrorBoundaryDeletePageException,
}
export default ErrorBoundary
