import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const UploadAnchor = styled.a`
  @media (max-width: 450px) {
    display: none;
  }
`

const UploadButton = ({ onClick }) => (
  <UploadAnchor className="nav-link nl-upload" onClick={onClick}>
    Upload
  </UploadAnchor>
)

UploadButton.propTypes = {
  onClick: PropTypes.func,
}

export default UploadButton
