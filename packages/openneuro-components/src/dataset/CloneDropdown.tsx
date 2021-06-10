import React from 'react'
import { Dropdown } from '../dropdown/Dropdown'
import { DatasetGitAccess } from './DatasetGitAccess'
import { Button } from '../button/Button'

export interface CloneDropdownProps {
  gitHash: string
  datasestId: string
}

export const CloneDropdown: React.FC<CloneDropdownProps> = ({
  gitHash,
  datasetId,
}) => {
  return (
    <div className="clone-dropdown">
      <Dropdown
        label={
          <Button className="clone-link" primary={true} label="Clone">
            <i className="fas fa-caret-up"></i>
            <i className="fas fa-caret-down"></i>
          </Button>
        }>
        <div>
          <span>
            <DatasetGitAccess
              configUrl="configurl"
              worker="worker"
              datasetId={datasetId}
              gitHash={gitHash}
            />
          </span>
        </div>
      </Dropdown>
    </div>
  )
}
