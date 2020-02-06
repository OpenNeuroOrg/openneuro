import React from 'react'
import PropTypes from 'prop-types'

const ShareDatasetLink = ({ datasetId }) => {
  return (
    <button
      className="btn-modal-action"
      onClick={async () => {
        await ShareDatasetPermissions({
          variables: { datasetId, userEmail, level: metadata },
        })
        done()
      }}>
      Share
    </button>
  )
}

ShareDatasetLink.propTypes = {
  datasetId: PropTypes.string,
}

export default ShareDatasetLink
