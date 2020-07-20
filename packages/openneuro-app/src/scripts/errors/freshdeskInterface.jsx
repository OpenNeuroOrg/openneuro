import React, { useState } from 'react'
import FreshdeskWidget from '../datalad/fragments/freshdesk-widget.jsx'
import {
  Overlay,
  ModalContainer,
  ExitButton,
} from '../../scripts/styles/support-modal.jsx'
import PropTypes from 'prop-types'

const FreshdeskInterface = props => {
  const [showModal, setShowModal] = useState(false)
  console.log(props)
  return (
    <>
      <p className="generic-error-message">
        {props.message || 'An error has occurred.'}
        <br />
        Please support us by documenting the issue with{' '}
        <a onClick={() => setShowModal(true)}>
          <u>FreshDesk</u>
        </a>
        .
      </p>
      {showModal && (
        <Overlay>
          <ModalContainer>
            <ExitButton onClick={() => setShowModal(false)}>&times;</ExitButton>
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
FreshdeskInterface.propTypes = {
  error: PropTypes.object,
  message: PropTypes.string,
  subject: PropTypes.string,
  description: PropTypes.string,
  eventId: PropTypes.string,
}

export default FreshdeskInterface
