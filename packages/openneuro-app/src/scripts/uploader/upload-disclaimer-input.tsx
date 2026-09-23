import React from "react"
import styled from "@emotion/styled"
import { Terms } from "../common/content/terms"

interface UploadDisclaimerInputProps {
  affirmedDefaced: boolean
  affirmedConsent: boolean
  syntheticDataset: boolean
  onChange: ({
    affirmedDefaced,
    affirmedConsent,
    syntheticDataset,
  }: {
    affirmedDefaced: boolean
    affirmedConsent: boolean
    syntheticDataset: boolean
  }) => void
}

const DisclaimerLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 20px;
  border-top: 1px solid;
  padding-top: 10px;
`

export const UploadDisclaimerInput: React.FunctionComponent<
  UploadDisclaimerInputProps
> = ({ affirmedDefaced, affirmedConsent, syntheticDataset, onChange }) => {
  return (
    <>
      <h4>
        By uploading this dataset to OpenNeuro I agree to the following
        conditions:
      </h4>
      <Terms />
      <p>
        Does this dataset contain synthetic data? If so, please contact the
        OpenNeuro team before uploading.
      </p>
      <input
        type="checkbox"
        onChange={(): void =>
          onChange({
            affirmedDefaced,
            affirmedConsent,
            syntheticDataset: !syntheticDataset,
          })}
        defaultChecked={syntheticDataset}
      />
      <b>&nbsp; This dataset contains synthetic data.</b>
      <p>Please affirm one of the following:</p>
      <DisclaimerLabel>
        <input
          type="checkbox"
          onChange={(): void =>
            onChange({
              affirmedDefaced: !affirmedDefaced,
              affirmedConsent,
              syntheticDataset,
            })}
          defaultChecked={affirmedDefaced}
        />
        &nbsp; All structural scans have been defaced, obscuring any tissue on
        or near the face that could potentially be used to reconstruct the
        facial structure.
      </DisclaimerLabel>
      <DisclaimerLabel>
        <input
          type="checkbox"
          onChange={(): void =>
            onChange({
              affirmedDefaced,
              affirmedConsent: !affirmedConsent,
              syntheticDataset,
            })}
          defaultChecked={affirmedConsent}
        />
        &nbsp; I have explicit participant consent and ethical authorization to
        publish structural scans without defacing.
      </DisclaimerLabel>
    </>
  )
}
