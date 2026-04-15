import React from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Button } from "../../components/button/Button"

const GET_HOLD_DELETION = gql`
  query getHoldDeletion($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      holdDeletion
    }
  }
`

const HOLD_DELETION = gql`
  mutation holdDeletion($datasetId: ID!, $hold: Boolean!) {
    holdDeletion(datasetId: $datasetId, hold: $hold)
  }
`

export const HoldDeletion = ({ datasetId }: { datasetId: string }) => {
  const { data, loading: queryLoading } = useQuery(GET_HOLD_DELETION, {
    variables: { datasetId },
  })
  const [holdDeletion, { loading: mutationLoading }] = useMutation(
    HOLD_DELETION,
    {
      refetchQueries: [{ query: GET_HOLD_DELETION, variables: { datasetId } }],
    },
  )

  const held = data?.dataset?.holdDeletion ?? false
  const loading = queryLoading || mutationLoading

  return (
    <span>
      <Button
        icon={loading
          ? "fa fa-spin fa-repeat"
          : held
          ? "fa fa-lock"
          : "fa fa-unlock"}
        label={loading
          ? "Updating..."
          : held
          ? "Deletion Held"
          : "Hold Deletion"}
        primary={!held}
        secondary={held}
        size="small"
        disabled={loading}
        onClick={() => {
          holdDeletion({ variables: { datasetId, hold: !held } })
        }}
      />
    </span>
  )
}
