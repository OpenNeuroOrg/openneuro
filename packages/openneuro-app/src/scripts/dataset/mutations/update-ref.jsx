import React from "react"
import PropTypes from "prop-types"
import { gql } from "@apollo/client"
import { Mutation } from "@apollo/client/react/components"
import { Button } from "@openneuro/components/button"
import { Tooltip } from "@openneuro/components/tooltip"

const RESET_DRAFT = gql`
  mutation resetDraft($datasetId: ID!, $ref: String!) {
    resetDraft(datasetId: $datasetId, ref: $ref)
  }
`

const UpdateRef = ({ datasetId, revision }) => (
  <Mutation mutation={RESET_DRAFT}>
    {(resetDraft) => (
      <Tooltip tooltip="Reset Draft Head">
        <Button
          iconOnly={true}
          icon="fa fa-history"
          label="Reset Draft Head"
          secondary={true}
          size="xsmall"
          onClick={() => {
            resetDraft({
              variables: {
                datasetId,
                ref: revision,
              },
            })
          }}
        />
      </Tooltip>
    )}
  </Mutation>
)

UpdateRef.propTypes = {
  datasetId: PropTypes.string,
  revision: PropTypes.string,
}

export default UpdateRef
