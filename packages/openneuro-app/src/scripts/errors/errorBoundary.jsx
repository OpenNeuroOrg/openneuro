import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import FreshdeskWidget from '../datalad/fragments/freshdesk-widget.jsx'
import DatasetContext from '../datalad/dataset/dataset-context.js'
import { Redirect, useParams, Link } from 'react-router-dom'
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
      { hasError: true, supportModal: false, error: error }
    : // don't show error handling component
      { hasError: false, supportModal: false, error: error }
}

const messageStyle = {
  color: 'red',
  padding: '40px',
  textAlign: 'center',
  fontSize: '20px',
}
const linkStyle = {
  textAlign: 'center',
  textDecoration: 'underline',
}

// redirects to specific error message OR redirects param datasetId if dataset id has changed
const DatasetRedirect = props => {
  const { datasetId } = useParams()
  const redirectLib = {
    ds002683: 'ds002938',
    ds001919: 'ds002902',
    ds002393: 'ds002900',
    ds001868: 'ds002904',
    ds002355: 'ds002841',
    ds001569: 'ds002848',
    ds002221: 'ds002842',
    ds001493: 'ds002797',
    ds001505: 'ds002743',
    ds001512: 'ds002739',
    ds001544: 'ds002737',
    ds001568: 'ds002735',
    ds001611: 'ds002733',
    ds001650: 'ds002731',
    ds001996: 'ds002726',
    ds002509: 'ds002741',
    ds001219: 'ds002734',
    ds002653: 'ds002728',
    ds001165: 'ds002750',
    ds001393: 'ds002738',
    ds001934: 'ds002727',
    ds002070: 'ds002711',
    ds001985: 'ds002712',
    ds002572: 'ds002647',
    ds001782: 'ds002614',
    ds002337: 'ds002606',
    ds002319: 'ds002609',
    ds001900: 'ds002608',
    ds002317: 'ds002602',
    ds002036: 'ds002596',
    ds001851: 'ds002574',
    ds001750: 'ds002550',
    ds002068: 'ds002543',
    ds002171: 'ds002380',
    ds002078: 'ds002149',
    ds002222: 'ds002250',
    ds002245: 'ds002345',
    ds001988: 'ds001996',
  }
  if (redirectLib.hasOwnProperty(datasetId)) {
    return <Redirect to={`/datasets/${redirectLib[datasetId]}`} />
  } else {
    return (
      <div>
        <p style={messageStyle}>{props.message}</p>
        <Link to="/">
          <p style={linkStyle}>Return to Homepage</p>
        </Link>
      </div>
    )
  }
}
DatasetRedirect.propTypes = {
  message: PropTypes.string,
}

const FreshdeskModal = props => {
  return (
    <>
      <p className="generic-error-message">
        {props.message || 'An error has occurred.'}
        <br />
        Please support us by documenting the issue with{' '}
        <a onClick={props.openModal}>
          <u>FreshDesk</u>
        </a>
        .
      </p>
      {props.supportModal && (
        <Overlay>
          <ModalContainer>
            <ExitButton onClick={props.closeModal}>&times;</ExitButton>
            <h3>Support</h3>
            <hr />
            <div>
              To ensure that we can quickly help resolve this issue, please
              provide as much detail as you can, including what you were trying
              to accomplish when the error occurred.
            </div>
            <FreshdeskWidget
              {...{
                subject: props.subject,
                description: props.description,
                error: props.error,
                sentryId: props.eventId,
              }}
            />
          </ModalContainer>
        </Overlay>
      )}
    </>
  )
}
FreshdeskModal.propTypes = {
  error: PropTypes.object,
  message: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  supportModal: PropTypes.bool,
  subject: PropTypes.string,
  description: PropTypes.string,
  eventId: PropTypes.string,
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

  componentDidCatch(error) {
    let message = this.state.message
    if (!this.props.dataset) {
      message = this.nonexistentDatasetMessage
    } else if (this.props.dataset && this.props.dataset.snapshots.length < 1) {
      message = 'This dataset has no associated snapshots.'
    }
    Sentry.withScope(scope => {
      scope.setTag('datasetId', this.props.datasetId)
      this.setState({
        eventId: Sentry.captureException(error),
        message: message,
      })
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
    const error = this.state.error || this.props.error
    const { supportModal, message } = this.state
    const { subject, description } = this.props
    if (error) {
      if (this.redirectMessages.includes(message)) {
        return <DatasetRedirect message={message} />
      } else {
        return (
          <FreshdeskModal
            message={message}
            error={error}
            openModal={this.openSupportModalFromLink}
            closeModal={this.closeSupportModal}
            subject={subject}
            description={description}
            supportModal={supportModal}
            eventId={this.props.eventId}
          />
        )
      }
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
