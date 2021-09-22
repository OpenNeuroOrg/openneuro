import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { Button } from '@openneuro/components/button'
import { Tooltip } from '@openneuro/components/tooltip'

const REVALIDATE = gql`
  mutation revalidate($datasetId: ID!, $ref: String!) {
    revalidate(datasetId: $datasetId, ref: $ref)
  }
`

const Revalidate = ({ datasetId, revision }) => (
  <Mutation mutation={REVALIDATE}>
    {revalidate => (
      <Tooltip tooltip="Revalidate Commit">
        <Button
          primary={true}
          iconOnly={true}
          label="Revalidate Commit"
          icon="fa fa-random"
          size="xsmall"
          onClick={() => {
            revalidate({
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

Revalidate.propTypes = {
  datasetId: PropTypes.string,
  revision: PropTypes.string,
}

export default Revalidate
