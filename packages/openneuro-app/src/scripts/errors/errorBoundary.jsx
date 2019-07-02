import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../utils/modal.jsx'
import FreshdeskWidget from '../datalad/fragments/freshdesk-widget.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    const errorAbove = Boolean(props.error)
    this.state = {
      hasError: errorAbove,
      supportModal: false,
      error: props.error,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, supportModal: true, error: error }
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
            <FreshdeskWidget {...{ subject, description, error }} />
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

export default ErrorBoundary
