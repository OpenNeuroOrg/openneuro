import React from 'react'
import PropTypes from 'prop-types'
import UploadStep from './upload-step.jsx'
import { Modal } from '../utils/modal.jsx'

// Show is always {true} because the router unmounts this otherwise
const UploaderModal = ({ setLocation, location, children }) => (
  <Modal
    show={location.pathname !== '/hidden'}
    onHide={() => setLocation('/hidden')}
    className="upload-modal">
    <Modal.Header closeButton>
      <Modal.Title>Upload Dataset</Modal.Title>
    </Modal.Header>
    <hr className="modal-inner" />
    <Modal.Body>
      <div className="tasks-col fade-in">
        <UploadStep location={location} />
        <div id="upload-tabs" className="uploader container">
          {children}
        </div>
      </div>
    </Modal.Body>
  </Modal>
)

UploaderModal.propTypes = {
  location: PropTypes.object,
  children: PropTypes.node,
  setLocation: PropTypes.func,
}

export default UploaderModal
