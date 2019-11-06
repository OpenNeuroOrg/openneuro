import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import FreshdeskWidget from '../datalad/fragments/freshdesk-widget.jsx'
import {
  Overlay,
  ModalContainer,
  ExitButton,
} from '../../scripts/styles/support-modal.jsx'

// raises error if catchErrorIf returns true
const getDerivedStateFromErrorOnCondition = (error, catchErrorIf) => {
  const raiseError =
    typeof catchErrorIf === 'function' ? catchErrorIf(error) : true
  return raiseError
    ? // trigger error component
      { hasError: true, supportModal: true, error: error }
    : // don't show error handling component
      { hasError: false, supportModal: false, error: error }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    const errorAbove = Boolean(props.error)
    this.state = {
      hasError: errorAbove,
      supportModal: false,
      error: props.error,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error) {
    return getDerivedStateFromErrorOnCondition(
      error,
      // error boundary should always be triggered in general case
      () => true,
    )
  }

  componentDidCatch(error) {
    Sentry.withScope(scope => {
      scope.setTag('datasetId', this.props.datasetId)
      this.setState({ eventId: Sentry.captureException(error) })
    })
  }

  closeSupportModal = () =>
    this.setState(prevState => ({
      ...prevState,
      supportModal: false,
    }))

  openSupportModalFromLink = e => {
    e.preventDefault()
    this.setState(prevState => ({
      ...prevState,
      supportModal: true,
    }))
  }

  render() {
    const { supportModal } = this.state
    const { subject, description } = this.props
    const error = this.props.error || this.state.error
    return this.state.hasError ? (
      <>
        <p className="generic-error-message">
          {this.props.errorMessage || 'An error has occurred.'}
          <br />
          Please support us by documenting the issue with{' '}
          <a onClick={this.openSupportModalFromLink}>
            <u>FreshDesk</u>
          </a>
          .
        </p>
        {supportModal && (
          <Overlay>
            <ModalContainer>
              <ExitButton onClick={this.closeSupportModal}>&times;</ExitButton>
              <h3>Support</h3>
              <hr />
              <div>
                To ensure that we can quickly help resolve this issue, please
                provide as much detail as you can, including what you were
                trying to accomplish when the error occurred.
              </div>
              <FreshdeskWidget
                {...{
                  subject,
                  description,
                  error,
                  sentryId: this.state.eventId,
                }}
              />
            </ModalContainer>
          </Overlay>
        )}
      </>
    ) : (
      this.props.children
    )
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

export { ErrorBoundaryAssertionFailureException }

export default ErrorBoundary
