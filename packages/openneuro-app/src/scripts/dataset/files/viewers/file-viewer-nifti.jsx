import React from 'react'
import PropTypes from 'prop-types'
import Papaya from '../../../common/partials/papaya.jsx'
import styled from '@emotion/styled'

const StyleWrapper = styled.div`
  div.papaya-wrap {
    margin: auto;
  }
`

const FileViewerNifti = ({ imageUrl }) => (
  <StyleWrapper>
    <Papaya image={imageUrl} />
  </StyleWrapper>
)

FileViewerNifti.propTypes = {
  imageUrl: PropTypes.string,
}

export default FileViewerNifti
