import React from "react"
import { Tooltip } from "../../components/tooltip/Tooltip"
import { Button } from "../../components/button/Button"

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}

export interface DatasetGitAccessProps {
  datasetId: string
  worker?: string
  configUrl: string
  gitHash: string
  configGithub?: string
  hasEdit?: boolean
}

export const DatasetGitAccess = ({
  datasetId,
  worker,
  configUrl,
  gitHash,
  configGithub,
  hasEdit,
}: DatasetGitAccessProps) => {
  const workerId = worker?.split("-").pop()
  const url = `${configUrl}/api/git/${datasetId}`
  const readURL = `https://github.com/${configGithub}/${datasetId}.git`
  return (
    <div className="dataset-git-access">
      <span>
        <h4>DataLad/Git URL</h4>
        <a href="https://docs.openneuro.org/git" target="_blank">
          View Documentation
        </a>
      </span>
      <div className="git-url">
        {workerId && (
          <Tooltip tooltip="Copy URL To Clipboard" flow="right">
            <Button
              onClick={() => copyToClipboard(readURL)}
              icon="fas fa-clipboard"
              size="small"
              iconSize="18px"
              label="copy Github url"
            />
          </Tooltip>
        )}
        <div>{readURL}</div>
      </div>
      {hasEdit && (
        <div className="git-url">
          {workerId && (
            <Tooltip tooltip="Copy URL To Clipboard" flow="right">
              <Button
                onClick={() => copyToClipboard(url)}
                icon="fas fa-clipboard"
                size="small"
                iconSize="18px"
                label="copy OpenNeuro url"
              />
            </Tooltip>
          )}
          <div>{url}</div>
        </div>
      )}

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
