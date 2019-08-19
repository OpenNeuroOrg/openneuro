import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../utils/modal.jsx'
import FreshdeskWidget from '../datalad/fragments/freshdesk-widget.jsx'

const getDerivedStateFromErrorOnCondition = (error, conditionCb) => {
  const raiseError = typeof conditionCb === 'function' ? conditionCb(error) : true
  return raiseError
    // trigger error component
    ? { hasError: true, supportModal: true, error: error }
    // don't show error handling component
    : { hasError: false, supportModal: false, error: error }
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
    return getDerivedStateFromErrorOnCondition(error, () => true)
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
        <Modal show={this.state.supportModal} onHide={this.closeSupportModal}>
          <Modal.Header closeButton>
            <Modal.Title>Support</Modal.Title>
          </Modal.Header>
          <hr className="modal-inner" />
          <Modal.Body>
            To ensure that we can quickly help resolve this issue, please
            provide as much detail as you can, including what you were trying to
            accomplish when the error occurred.
            <FreshdeskWidget
              {...{ subject, description, error, sentryId: this.state.eventId }}
            />
          </Modal.Body>
          <Modal.Footer>
            <a onClick={this.closeSupportModal}>Close</a>
          </Modal.Footer>
        </Modal>
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
}

class ErrorBoundaryAssertionFailureException extends ErrorBoundary {
  constructor() {
    super()
  }

  static getDerivedStateFromError(error) {
    return getDerivedStateFromErrorOnCondition(
      error, 
      error => error.toString() === 'Error: assertion failure'
    )
  }
}

export default ErrorBoundary
