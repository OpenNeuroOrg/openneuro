import React from "react"
import { gql, useMutation } from "@apollo/client"
import PropTypes from "prop-types"
import { Button } from "../../components/button/Button"
import styled from "@emotion/styled"

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-gap: 1.3em;
  place-items: start;
`

const SuccessMessage = styled.p({
  color: "rgb(92, 184, 92)",
})
const InProgressMessage = styled.p({
  color: "orange",
})
const ErrorMessage = styled.p({
  color: "red",
})

const CREATE_MOSAIC = gql`
  mutation createMosaic($datasetId: ID!, $ref: String!) {
    createMosaic(datasetId: $datasetId, ref: $ref)
  }
`

const CreateMosaic = ({ datasetId, revision }) => {
  const [mosaicMutation, { data, loading, error }] = useMutation(
    CREATE_MOSAIC,
  )
  const success = data && data.createMosaic
  return (
    <div className="dataset-form">
      {loading && (
        <InProgressMessage>Mosaic creation is starting.</InProgressMessage>
      )}
      {error && <ErrorMessage>An error has occurred.</ErrorMessage>}
      {success && <SuccessMessage>Mosaic creation has begun.</SuccessMessage>}
      <ButtonRow>
        <Button
          icon="fa fa-rocket"
          label="Create Mosaic"
          primary={true}
          size="small"
          onClick={() => {
            mosaicMutation({
              variables: {
                datasetId,
                ref: revision,
              },
            })
          }}
        />
      </ButtonRow>
    </div>
  )
}

CreateMosaic.propTypes = {
  datasetId: PropTypes.string,
  revision: PropTypes.string,
}

export default CreateMosaic
