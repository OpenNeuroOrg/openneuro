import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'
import { TooltipSpan } from '../fragments/copyable-tooltip.jsx'

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
      <TooltipSpan
        className="flag-annex-object"
        data-tip="Use this to alert site admins if this file has been found to contain subject sensitive data.">
        <WarnButton
          message="Flag"
          icon="fa-exclamation-triangle"
          warn={true}
          className="edit-file"
          action={cb => {
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
      </TooltipSpan>
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
