import React from "react"
import { gql } from "@apollo/client"
import { Mutation } from "@apollo/client/react/components"
import { Button } from "../../components/button/Button"
const FSCK_DATASET = gql`
  mutation fsckDataset($datasetId: ID!) {
    fsckDataset(datasetId: $datasetId)
  }
`

type FsckDatasetProps = {
  datasetId: string
}

export const FsckDataset = ({ datasetId }: FsckDatasetProps) => (
  <Mutation mutation={FSCK_DATASET}>
    {(fsckDataset) => (
      <span>
        <Button
          icon="fa fa-repeat"
          label="Rerun File Checks"
          primary={true}
          size="small"
          onClick={() => {
            fsckDataset({
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
