import React from 'react'
import { Tooltip } from '../tooltip/Tooltip'
import { Button } from '../button/Button'

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}

export interface DatasetGitAccessProps {
  datasetId: string
  worker: string
  configUrl: string
  gitHash: string
}

export const DatasetGitAccess = ({
  datasetId,
  worker,
  configUrl,
  gitHash,
}: DatasetGitAccessProps) => {
  const workerId = worker.split('-').pop()
  const url = `${configUrl}/git/${workerId}/${datasetId}`
  return (
    <div className="dataset-git-access">
      <span>
        <h4>DataLad/Git URL</h4>
        <a href="https://docs.openneuro.org/git" target="_blank">
          View Documentation
        </a>
      </span>
      <div className="git-url">
        <Tooltip tooltip="Copy URL To Clipboard" flow="right">
          <Button
            onClick={() => copyToClipboard(url)}
            icon="fas fa-clipboard"
            size="small"
            iconSize="18px"
            label="copy git URL"
          />
        </Tooltip>
        <div>{url}</div>
      </div>
      <div className="git-hash">
        <Tooltip tooltip="Copy Git Hash to Clipboard" flow="right">
          <Button
            onClick={() => copyToClipboard(gitHash)}
            icon="fas fa-clipboard"
            size="small"
            iconSize="18px"
            label="copy git hash"
          />
        </Tooltip>
        <div>Git Hash: {gitHash.slice(0, 7)}</div>
      </div>
    </div>
  )
}
