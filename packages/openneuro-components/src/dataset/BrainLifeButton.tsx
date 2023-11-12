import React from "react"
import { Tooltip } from "../tooltip/Tooltip"
import { Button } from "../button/Button"

export interface BrainLifeButtonProps {
  datasetId: string
  snapshotVersion?: string
  onBrainlife: boolean
}

export const BrainLifeButton: React.FC<BrainLifeButtonProps> = ({
  datasetId,
  snapshotVersion,
  onBrainlife,
}) => {
  const url = snapshotVersion
    ? `https://brainlife.io/openneuro/${datasetId}/${snapshotVersion}`
    : `https://brainlife.io/openneuro/${datasetId}`
  return (
    <>
      {onBrainlife && (
        <div className="brainlife-block">
          <Tooltip tooltip="Analyze on brainlife" flow="up">
            <Button
              className="brainlife-link"
              primary={true}
              size="small"
              onClick={() => {
                window.open(url, "_blank")
              }}
              label="brainlife.io"
            />
          </Tooltip>
        </div>
      )}
    </>
  )
}
