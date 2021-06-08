import React from 'react'
import { Tooltip } from '../tooltip/Tooltip'

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}

export interface DatasetGitAccessProps {
  datasetId: string
  worker: string
  configUrl: string
}

export const DatasetGitAccess = ({
  datasetId,
  worker,
  configUrl,
}: DatasetGitAccessProps) => {
  const workerId = worker.split('-').pop()
  const url = `${configUrl}/git/${workerId}/${datasetId}`
  return (
    <div className="col-xs-12">
      <h3 className="metaheader">DataLad/Git URL</h3>
      <div className="status panel panel-default">
        <Tooltip tooltip="Copy To Clipboard" flow="up">
          <button
            className="warning btn-warn-component"
            onClick={() => copyToClipboard(url)}>
            <i className="fa fa-clipboard" aria-hidden="true"></i>
          </button>
        </Tooltip>
        <div>{url}</div>
        <a href="https://docs.openneuro.org/git">View Documentation</a>
      </div>
    </div>
  )
}
