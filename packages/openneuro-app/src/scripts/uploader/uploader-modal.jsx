import React from "react"
import PropTypes from "prop-types"
import { Modal } from "@openneuro/components/modal"

// Show is always {true} because the router unmounts this otherwise
const UploaderModal = ({ setLocation, location, children, footer }) => (
  <Modal
    isOpen={location.pathname !== "/hidden" ? true : false}
    toggle={() => setLocation("/hidden")}
    closeText={"close"}
    className="upload-modal"
  >
    <h3>Upload Dataset</h3>
    {children}
    {footer ? footer : null}
  </Modal>
)

UploaderModal.propTypes = {
  location: PropTypes.object,
  children: PropTypes.node,
  footer: PropTypes.node,
  setLocation: PropTypes.func,
}

export default UploaderModal
