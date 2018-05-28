import React from 'react'
import PropTypes from 'prop-types'

const UploadButton = ({ onClick }) => (
  <span className="upload-btn-wrap">
    <a className="nav-link nl-upload" onClick={onClick}>
      <span className="link-name">
        <i className="fa fa-upload" /> Upload Dataset
      </span>
    </a>
  </span>
)

UploadButton.propTypes = {
  onClick: PropTypes.func,
}

export default UploadButton
