import React from 'react'
import PropTypes from 'prop-types'
import Papaya from '../../common/partials/papaya.jsx'

const FileViewerNifti = ({ imageUrl }) => <Papaya image={imageUrl} />

FileViewerNifti.propTypes = {
  imageUrl: PropTypes.string,
}

export default FileViewerNifti
