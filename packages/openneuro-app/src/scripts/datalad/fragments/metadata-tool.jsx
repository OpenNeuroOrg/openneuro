import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import WarnButton from '../../common/forms/warn-button.jsx'

const MetadataTool = ({ datasetId, metadata }) => {
  const history = useHistory()
  const location = useLocation()
  const hasMetadata = metadata !== null
  return (
    <WarnButton
      tooltip={hasMetadata ? 'Metadata' : 'Add Metadata'}
      icon={hasMetadata ? 'fa-file-code-o' : 'fa-file-code-o icon-plus'}
      warn={false}
      action={cb => {
        history.push({
          pathname: `/datasets/${datasetId}/metadata`,
          state: {
            submitPath: location.pathname,
          },
        })
        cb()
      }}
    />
  )
}

MetadataTool.propTypes = {
  metadata: PropTypes.object,
  following: PropTypes.object,
  datasetId: PropTypes.string,
}

export default MetadataTool
