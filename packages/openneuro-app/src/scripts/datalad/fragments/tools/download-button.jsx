import React, { useState } from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../../../common/forms/warn-button.jsx'

const DownloadButton = ({ action }) => {
  return (
    <WarnButton
      tooltip="Download Dataset"
      icon="fa-download"
      warn={false}
      action={action}
    />
  )
}

DownloadButton.propTypes = {
  title: PropTypes.string,
}

export default DownloadButton
