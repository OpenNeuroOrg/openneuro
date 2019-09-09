import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import WarnButton from '../../common/forms/warn-button.jsx'

const MetadataTool = ({ datasetId, metadata, history, location }) => {
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
  history: PropTypes.object,
  location: PropTypes.object,
}

export default withRouter(MetadataTool)
