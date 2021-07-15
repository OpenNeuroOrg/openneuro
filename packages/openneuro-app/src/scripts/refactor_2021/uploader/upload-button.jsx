import React from 'react'
import PropTypes from 'prop-types'

const UploadButton = ({ onClick }) => (
  <a className="nav-link nl-upload" onClick={onClick}>
    Upload
  </a>
)

UploadButton.propTypes = {
  onClick: PropTypes.func,
}

export default UploadButton
