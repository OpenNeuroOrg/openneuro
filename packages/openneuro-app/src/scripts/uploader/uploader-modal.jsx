import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../utils/modal.jsx'
import UploaderContext from './uploader-context.js'

// Show is always {true} because the router unmounts this otherwise
const UploaderModal = ({ children }) => (
  <UploaderContext.Consumer>
    {({ setLocation }) => (
      <Modal
        show={true}
        onHide={() => setLocation('/hidden')}
        className="upload-modal">
        <Modal.Header closeButton>
          <Modal.Title>Upload Dataset</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="tasks-col fade-in">{children}</div>
        </Modal.Body>
      </Modal>
    )}
  </UploaderContext.Consumer>
)

UploaderModal.propTypes = {
  children: PropTypes.node,
  setLocation: PropTypes.func,
}

export default UploaderModal
