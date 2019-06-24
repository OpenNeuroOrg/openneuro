import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../utils/modal.jsx'
import config from '../../../config'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      supportModal: false,
    }
  }

  static getDerivedStateFromError(error) {
    console.log('in static', error)
    return { hasError: true, supportModal: true }
  }

  componentDidCatch(error, info) {
    console.log('in catch', { error, info })
  }

  componentDidMount() {
    window.addEventListener('error', this.handleGlobalError)
  }
  componentWillUnmount() {
    window.removeEventListener('error', this.handleGlobalError)
  }

  handleGlobalError = e => {
    console.log('global error', e)
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
            If you have a question about details of a particular dataset
            (clarifying the design, asking for additional metadata etc.) please
            post it as a comment underneath the dataset. If you would like to
            suggest a new feature please post it at
            <a href="https://openneuro.featureupvote.com/">
              https://openneuro.featureupvote.com/
            </a>
            <script
              type="text/javascript"
              src="https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js"
            />
            <style type="text/css" media="screen, projection">
              {
                '@import url(https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css); '
              }
            </style>
            <iframe
              title="Feedback Form"
              className="freshwidget-embedded-form"
              id="freshwidget-embedded-form"
              src={config.support.url}
              scrolling="no"
              height="500px"
              width="100%"
              frameBorder="0"
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

export default ErrorBoundary
