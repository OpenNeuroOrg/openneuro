import React from "react"
import PropTypes from "prop-types"
import { gql } from "@apollo/client"
import { Mutation } from "@apollo/client/react/components"
import { WarnButton } from "../../components/warn-button/WarnButton"
import { Tooltip } from "../../components/tooltip/Tooltip"

const REMOVE_ANNEX_OBJECT = gql`
  mutation removeAnnexObject(
    $datasetId: ID!
    $snapshot: String!
    $annexKey: String!
    $path: String
    $filename: String
  ) {
    removeAnnexObject(
      datasetId: $datasetId
      snapshot: $snapshot
      annexKey: $annexKey
      path: $path
      filename: $filename
    )
  }
`

const RemoveAnnexObject = ({
  datasetId,
  snapshot,
  annexKey,
  path,
  filename,
}) => (
  <Mutation mutation={REMOVE_ANNEX_OBJECT} awaitRefetchQueries={true}>
    {(removeAnnexObject) => (
      // fa-exclamation-triangle might be better
      <Tooltip
        className="remove-annex-object"
        tooltip="Purge: this admin tool will remove this file's annex objects."
      >
        <WarnButton
          message=""
          iconOnly={true}
          icon="fa-frown-o"
          className="edit-file"
          onConfirmedClick={() => {
            removeAnnexObject({
              variables: {
                datasetId,
                snapshot: snapshot || "HEAD",
                annexKey,
                path,
                filename,
              },
            })
          }}
        />
      </Tooltip>
    )}
  </Mutation>
)

RemoveAnnexObject.propTypes = {
  datasetId: PropTypes.string,
  snapshot: PropTypes.string,
  annexKey: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default RemoveAnnexObject
