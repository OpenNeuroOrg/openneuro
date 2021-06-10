import React from 'react'
import { Tooltip } from '../tooltip/Tooltip'
import { Button } from '../button/Button'

export interface BrainLifeButtonProps {
  datasetId: string
  onBrainlife: boolean
}

export const BrainLifeButton: React.FC<BrainLifeButtonProps> = ({
  datasetId,
  onBrainlife,
}) => {
  const goToBrainlife = datasetId => {
    window.open(`https://brainlife.io/openneuro/${datasetId}`, '_blank')
  }
  return (
    <>
      {onBrainlife && (
        <div className="brainlife-block">
          <Tooltip tooltip="Analyze on brainlife" flow="up">
            <Button
              className="brainlife-link"
              primary={true}
              onClick={() => goToBrainlife(datasetId)}
              label="brainlife.io"
            />
          </Tooltip>
        </div>
      )}
    </>
  )
}
