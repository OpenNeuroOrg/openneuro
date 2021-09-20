import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { WarnButton } from '@openneuro/components/warn-button'
import { Tooltip } from '@openneuro/components/tooltip'

const FLAG_ANNEX_OBJECT = gql`
  mutation flagAnnexObject(
    $datasetId: ID!
    $snapshot: String!
    $filepath: String!
    $annexKey: String!
  ) {
    flagAnnexObject(
      datasetId: $datasetId
      snapshot: $snapshot
      filepath: $filepath
      annexKey: $annexKey
    )
  }
`

const FlagAnnexObject = ({ datasetId, snapshot, filepath, annexKey }) => (
  <Mutation mutation={FLAG_ANNEX_OBJECT} awaitRefetchQueries={true}>
    {flagAnnexObject => (
      // fa-exclamation-triangle might be better
      <Tooltip
        className="flag-annex-object"
        tooltip="Flag: use this to alert site admins if this file has been found to contain subject sensitive data.">
        <WarnButton
          message=""
          icon="fa-exclamation-triangle"
          className="edit-file"
          onConfirmedClick={cb => {
            flagAnnexObject({
              variables: {
                datasetId,
                snapshot: snapshot || 'HEAD',
                filepath,
                annexKey,
              },
            }).then(() => {
              cb()
            })
          }}
        />
      </Tooltip>
    )}
  </Mutation>
)

FlagAnnexObject.propTypes = {
  datasetId: PropTypes.string,
  snapshot: PropTypes.string,
  annexKey: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default FlagAnnexObject
