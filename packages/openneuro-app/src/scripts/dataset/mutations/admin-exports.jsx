import React from "react"
import { gql, useMutation } from "@apollo/client"
import PropTypes from "prop-types"
import { Button } from "@openneuro/components/button"
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

const REEXPORT_REMOTES = gql`
  mutation reexportRemotes($datasetId: ID!) {
    reexportRemotes(datasetId: $datasetId)
  }
`

const AdminExports = ({ dataset }) => {
  const [reexportRemotes, { data, loading, error }] = useMutation(
    REEXPORT_REMOTES,
  )
  const success = data && data.reexportRemotes
  return (
    <div className="dataset-form">
      {loading && (
        <InProgressMessage>Your export is starting.</InProgressMessage>
      )}
      {error && <ErrorMessage>An error has occurred.</ErrorMessage>}
      {success && <SuccessMessage>Your export has begun.</SuccessMessage>}
      <ButtonRow>
        <Button
          icon="fa fa-rocket"
          label="Run Export"
          primary={true}
          size="small"
          onClick={() => {
            reexportRemotes({ variables: { datasetId: dataset.id } })
          }}
        />
      </ButtonRow>
    </div>
  )
}

AdminExports.propTypes = {
  dataset: PropTypes.object,
}

export default AdminExports
