import React from 'react'
import Markdown from 'markdown-to-jsx'
import bytes from 'bytes'
import pluralize from 'pluralize'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'

import { Button } from '../button/Button'
import { Tooltip } from '../tooltip/Tooltip'
import { Dropdown } from '../dropdown/Dropdown'
import { DatasetGitAccess } from './DatasetGitAccess'

import './dataset-page.scss'

export interface DraftDatasetPageExampleProps {
  dataset
}
const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]
// Helper function for getting version from URL

const snapshotVersion = location => {
  const matches = location.pathname.match(/versions\/(.*?)(\/|$)/)
  return matches && matches[1]
}

export const DraftDatasetPageExample = ({
  dataset,
}: DraftDatasetPageExampleProps) => {
  const summary = dataset.draft.summary
  const description = dataset.draft.description
  const datasetId = dataset.id

  const isPublic = dataset.public === true

  const snapshot = snapshotVersion(location)
  const rootPath = snapshot
    ? `/datasets/${datasetId}/versions/${snapshot}`
    : `/datasets/${datasetId}`

  const arrayToMarkdown = arr => {
    return arr ? arr.map(element => ` * ${element}\n`).join('') : ''
  }
  const goToToolPath = (history, rootPath, path) => {
    history.push(`${rootPath}/${path}`)
  }
  const goToBrainlife = datasetId => {
    window.open(`https://brainlife.io/openneuro/${datasetId}`, '_blank')
  }

  const numSessions = summary.sessions.length > 0 ? summary.sessions.length : 1
  const subjects = summary && (
    <span>
      <h2> {pluralize('Subject', summary.subjects.length)}: </h2>
      {summary.subjects.length}
    </span>
  )
  const sessions = summary && (
    <span>
      <h2>{pluralize('Session', numSessions)}: </h2>
      {numSessions}
    </span>
  )

  const dateAdded = formatDate(dataset.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(dataset.created))
  const dateUpdated = formatDate(
    dataset.snapshots[dataset.snapshots.length - 1].created,
  )
  const dateUpdatedDifference = formatDistanceToNow(
    parseISO(dataset.snapshots[dataset.snapshots.length - 1].created),
  )

  const lastUpdatedDate = dataset.snapshots.length ? (
    <div className="updated-date">
      <h2>Last Updated: </h2>
      {dateUpdated} - {dateUpdatedDifference} ago
    </div>
  ) : null

  const uploader = (
    <div className="uploader">
      <h2>Uploaded by: </h2>
      {dataset.uploader.name} on {dateAdded} - {dateAddedDifference} ago
    </div>
  )

  const backgroundColorLight = 'rgba(109, 83, 156, 1)'
  const backgroundColorDark = 'rgba(57, 41, 86, 1)'
  //TODO setup  Redirect, Errorboundry, and Edit functionality
  return (
    <>
      <div
        className="dataset-header"
        style={{
          backgroundColor: backgroundColorLight,
          background: `linear-gradient(16deg, ${backgroundColorDark} 0%, ${backgroundColorLight} 70%)`,
        }}>
        <div className="container">
          <div className="grid grid-between">
            <div className="col">
              <h1>
                <a href={'/' + summary.modalities[0]}>
                  <div className="hexagon-wrapper">
                    <div className="hexagon no-modality"></div>
                    <div className="label">{summary.modalities[0]}</div>
                  </div>
                </a>
                {description.Name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {isPublic && (
        <div className="dataset-header-alert">
          This dataset has not been published!
          <a href="">Publish the Dataset</a> to make all snapshots available
          publicly.
        </div>
      )}

      <div className="container">
        <div className="grid grid-between">
          <div className="col">
            <div className="dataset-header-meta">
              <span>OpenNeuro Accession Number:</span> {datasetId}
              <span>Files:</span> {summary.totalFiles}
              <span>Size:</span> {bytes(summary.size)}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="grid grid-between">
          <div className="col col-8">
            <div className="dataset-validation">
              <div className="validation-accordion">validation</div>
              {dataset.onBrainlife && (
                <div className="brainlife-block">
                  <Tooltip tooltip="Analyze on brainlife" flow="up">
                    <Button
                      className="brainlife-link"
                      primary={true}
                      onClick={() => goToBrainlife(dataset.id)}
                      label="brainlife.io"
                    />
                  </Tooltip>
                </div>
              )}
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
                      />
                    </span>
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="dataset-tool-buttons">
              <Tooltip tooltip="Publish the dataset publicly" flow="right">
                <Button
                  className="dataset-tool"
                  onClick={() => goToToolPath(history, rootPath, 'publish')}
                  label="Publish"
                  icon="fa fa-globe"
                />
              </Tooltip>
              <Tooltip
                tooltip="Share this dataset with collaborators"
                flow="up">
                <Button
                  className="dataset-tool"
                  onClick={() => goToToolPath(history, rootPath, 'share')}
                  label="Share"
                  icon="fa fa-user"
                />
              </Tooltip>

              <Tooltip tooltip="Create a new version of the dataset" flow="up">
                <Button
                  className="dataset-tool"
                  onClick={() => goToToolPath(history, rootPath, 'snapshot')}
                  label="Snapshot"
                  icon="fa fa-camera"
                />
              </Tooltip>
              <span>
                <Button
                  className="dataset-tool"
                  onClick={() => goToToolPath(history, rootPath, 'download')}
                  label="Download"
                  icon="fa fa-download"
                />
              </span>
              <Tooltip
                wrapText={true}
                tooltip="A form to describe your dataset (helps colleagues discover your dataset)"
                flow="up">
                <Button
                  className="dataset-tool"
                  onClick={() => goToToolPath(history, rootPath, 'metadata')}
                  label="Metadata"
                  icon="fas fa-file-code"
                />
              </Tooltip>
              <Tooltip tooltip="Remove your dataset from OpenNeuro" flow="up">
                <Button
                  className="dataset-tool"
                  onClick={() => goToToolPath(history, rootPath, 'delete')}
                  label="Delete"
                  icon="fas fa-trash"
                />
              </Tooltip>
            </div>

            <div className="dataset-readme">
              <h2>README</h2>
              {dataset.draft.readme == null ? 'N/A' : dataset.draft.readme}
            </div>
          </div>
          <div className="col">
            <h2>Authors</h2>

            <Markdown>{arrayToMarkdown(description.Authors) || 'N/A'}</Markdown>
            <h2>Available Modalities</h2>

            <Markdown>{arrayToMarkdown(summary.modalities) || 'N/A'}</Markdown>
            <h2>Tasks</h2>

            <Markdown>{arrayToMarkdown(summary.tasks) || 'N/A'}</Markdown>
            {uploader}
            {lastUpdatedDate}
            {sessions}

            {subjects}
            <h2>Dataset DOI</h2>

            {description.DatasetDOI ||
              'Create a new snapshot to obtain a DOI for the snapshot.'}
            <h2>License</h2>

            <Markdown>{description.License || ''}</Markdown>

            <h2>Acknowledgements</h2>
            <Markdown>{description.Acknowledgements || 'N/A'}</Markdown>
            <h2>How to Acknowledge</h2>
            <Markdown>{description.HowToAcknowledge || 'N/A'}</Markdown>

            <h2>Funding</h2>

            <Markdown>{arrayToMarkdown(description.Funding) || 'N/A'}</Markdown>

            <h2>References and Links</h2>

            <Markdown>
              {arrayToMarkdown(description.ReferencesAndLinks) || 'N/A'}
            </Markdown>

            <h2>Ethics Approvals</h2>

            <Markdown>
              {arrayToMarkdown(description.EthicsApprovals) || 'N/A'}
            </Markdown>
          </div>
        </div>
      </div>
    </>
  )
}
