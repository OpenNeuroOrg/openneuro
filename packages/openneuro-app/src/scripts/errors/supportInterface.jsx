import React, { useState } from "react"
import ZammadWidget from "../common/partials/zammad-widget"
import {
  ExitButton,
  ModalContainer,
  Overlay,
} from "../styles/support-modal.jsx"
import PropTypes from "prop-types"

const SupportInterface = (props) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <p className="generic-error-message">
        {props.message || "An error has occurred."}
        <br />
        Please support us by{" "}
        <a onClick={() => setShowModal(true)}>
          <u>documenting the issue</u>
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
            <ZammadWidget
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
SupportInterface.propTypes = {
  error: PropTypes.object,
  message: PropTypes.string,
  subject: PropTypes.string,
  description: PropTypes.string,
  eventId: PropTypes.string,
}

export default SupportInterface
