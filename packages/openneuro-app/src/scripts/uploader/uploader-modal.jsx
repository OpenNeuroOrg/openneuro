import React from 'react'
import PropTypes from 'prop-types'
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
        <div id="upload-tabs" className="uploader">
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
