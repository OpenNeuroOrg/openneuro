import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import DatasetContext from '../datalad/dataset/dataset-context.js'
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
    const errorAbove = Boolean(props.error)
    this.state = {
      hasError: false,
      error: props.error,
      eventId: null,
      message: props.error ? props.error.message : '',
    }
  }

  nonexistentDatasetMessage = 'This dataset does not exist.'

  // any error message that should trigger a link back to the dashboard
  //   rather than the freshdesk modal link
  redirectMessages = [
    this.nonexistentDatasetMessage,
    'GraphQL error: You do not have access to read this dataset.',
  ]

  static getDerivedStateFromError(error) {
    return getDerivedStateFromErrorOnCondition(
      error,
      // error boundary should always be triggered in general case
      () => true,
    )
  }

  componentDidCatch(error, { componentStack }) {
    let message = this.state.message

    if (!this.props.dataset) {
      message = this.nonexistentDatasetMessage
    } else if (this.props.dataset && this.props.dataset.snapshots.length < 1) {
      message = 'This dataset has no associated snapshots.'
    }
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
    const error = this.state.error || this.props.error
    const { message } = this.state

    const { subject, description } = this.props
    if (error) {
      return (
        <FreshdeskInterface
          message={message}
          error={error}
          subject={subject}
          description={description}
          eventId={this.props.eventId}
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
  error: PropTypes.string,
  subject: PropTypes.string,
  description: PropTypes.string,
  loading: PropTypes.bool,
  snapshotId: PropTypes.bool,
  dataset: PropTypes.object,
  eventId: PropTypes.string,
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

ErrorBoundaryAssertionFailureException.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  errorMessage: PropTypes.string,
}

const ErrorBoundaryWithDataSet = props => (
  <DatasetContext.Consumer>
    {dataset => <ErrorBoundary {...props} dataset={dataset} />}
  </DatasetContext.Consumer>
)
export { ErrorBoundaryAssertionFailureException, ErrorBoundaryWithDataSet }
export default ErrorBoundary
