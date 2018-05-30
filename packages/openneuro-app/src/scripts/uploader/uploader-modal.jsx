import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../utils/modal.jsx'

// Show is always {true} because the router unmounts this otherwise
const UploaderModal = ({ setLocation, location, children, footer }) => (
  <Modal
    show={location.pathname !== '/hidden'}
    onHide={() => setLocation('/hidden')}
    className="upload-modal">
    <Modal.Header closeButton>
      <Modal.Title>Upload Dataset</Modal.Title>
    </Modal.Header>
    <hr className="modal-inner" />
    <Modal.Body>{children}</Modal.Body>
    {footer ? <Modal.Footer>{footer}</Modal.Footer> : null}
  </Modal>
)

UploaderModal.propTypes = {
  location: PropTypes.object,
  children: PropTypes.node,
  footer: PropTypes.node,
  setLocation: PropTypes.func,
}

export default UploaderModal
