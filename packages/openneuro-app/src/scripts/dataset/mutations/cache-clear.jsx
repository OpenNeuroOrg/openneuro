import React from "react"
import PropTypes from "prop-types"
import { gql } from "@apollo/client"
import { Mutation } from "@apollo/client/react/components"
import { Button } from "@openneuro/components/button"
const CACHE_CLEAR = gql`
  mutation cacheClear($datasetId: ID!) {
    cacheClear(datasetId: $datasetId)
  }
`

const CacheClear = ({ datasetId }) => (
  <Mutation mutation={CACHE_CLEAR}>
    {(cacheClear) => (
      <span>
        <Button
          icon="fa fa-eraser"
          label=" Delete Dataset Cache"
          primary={true}
          size="small"
          onClick={() => {
            cacheClear({
              variables: {
                datasetId,
              },
            })
          }}
        />
      </span>
    )}
  </Mutation>
)

CacheClear.propTypes = {
  datasetId: PropTypes.string,
}

export default CacheClear
