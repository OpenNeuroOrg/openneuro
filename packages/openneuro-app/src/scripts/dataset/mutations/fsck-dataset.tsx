import React, { useEffect, useState } from "react"
import { gql, useMutation } from "@apollo/client"
import { Button } from "../../components/button/Button"

const FSCK_DATASET = gql`
  mutation fsckDataset($datasetId: ID!) {
    fsckDataset(datasetId: $datasetId)
  }
`

type FsckDatasetProps = {
  datasetId: string
  disabled: boolean
}

export const FsckDataset = ({ datasetId, disabled }: FsckDatasetProps) => {
  const [fsckDataset, { loading }] = useMutation(FSCK_DATASET)
  const [status, setStatus] = useState<"idle" | "success" | "failure">("idle")

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => setStatus("idle"), 2000)
      return () => clearTimeout(timer)
    }
  }, [status])

  return (
    <span>
      <Button
        icon={loading
          ? "fa fa-spin fa-repeat"
          : status === "success"
          ? "fa fa-check"
          : status === "failure"
          ? "fa fa-exclamation-triangle"
          : "fa fa-repeat"}
        label={loading
          ? "Running..."
          : status === "success"
          ? "Success"
          : "Rerun File Checks"}
        primary={true}
        size="small"
        disabled={disabled || loading}
        onClick={async () => {
          try {
            const { data } = await fsckDataset({
              variables: {
                datasetId,
              },
            })
            if (data.fsckDataset) {
              setStatus("success")
            } else {
              setStatus("failure")
            }
          } catch (e) {
            setStatus("failure")
          }
        }}
      />
      {status === "failure" && (
        <span style={{ display: "block", color: "red", marginTop: "5px" }}>
          Too many recent requests, please try again later.
        </span>
      )}
    </span>
  )
}
