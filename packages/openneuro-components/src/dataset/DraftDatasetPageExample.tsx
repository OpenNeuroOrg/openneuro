import React from 'react'
import Markdown from 'markdown-to-jsx'
import { Link, useLocation } from 'react-router-dom'
import { Modal } from '../modal/Modal'

import bytes from 'bytes'
import pluralize from 'pluralize'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import { VersionListContainerExample } from './VersionListContainerExample'
import { DatasetPage } from './DatasetPage'
import { Button } from '../button/Button'
import { Tooltip } from '../tooltip/Tooltip'
import { Dropdown } from '../dropdown/Dropdown'
import { DatasetGitAccess } from './DatasetGitAccess'
import { ReadMore } from '../read-more/ReadMore'
import { MetaDataBlock } from './MetaDataBlock'

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
  const location = useLocation()
  const activeDataset = snapshotVersion(location) || 'draft'

  const [selectedVersion, setSelectedVersion] = React.useState(activeDataset)
  const [deprecatedmodalIsOpen, setDeprecatedModalIsOpen] =
    React.useState(false)

  const snapshots = dataset.snapshots

  const summary = dataset.draft.summary
  const description = dataset.draft.description
  const datasetId = dataset.id

  const isPublic = dataset.public === true

  const rootPath = activeDataset
    ? `/datasets/${datasetId}/versions/${activeDataset}`
    : `/datasets/${datasetId}`

  const goToToolPath = (history, rootPath, path) => {
    history.push(`${rootPath}/${path}`)
  }

  const goToBrainlife = datasetId => {
    window.open(`https://brainlife.io/openneuro/${datasetId}`, '_blank')
  }

  const numSessions = summary.sessions.length > 0 ? summary.sessions.length : 1

  const dateAdded = formatDate(dataset.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(dataset.created))

  const dateModified = formatDate(dataset.draft.modified)

  const dateUpdatedDifference = formatDistanceToNow(
    parseISO(dataset.draft.modified),
  )

  const backgroundColorLight = 'rgba(109, 83, 156, 1)'
  const backgroundColorDark = 'rgba(57, 41, 86, 1)'
  //TODO setup  Redirect, Errorboundry, and Edit functionality

  //TODO Setup hasEdit
  const hasEdit = true
  // (user && user.admin) ||
  // hasEditPermissions(dataset.permissions, user && user.sub)
  return (
    <>
      <DatasetPage
        renderSidebar={() => (
          <>
            <MetaDataBlock
              heading="Authors"
              item={description.Authors}
              isMarkdown={true}
              className="dmb-inline-list"
            />
            <MetaDataBlock
              heading="Available Modalities"
              item={summary.modalities}
              isMarkdown={true}
              className="dmb-modalities"
            />
            <MetaDataBlock
              heading="Tasks"
              item={summary.tasks}
              isMarkdown={true}
              className="dmb-inline-list"
            />

            <MetaDataBlock
              heading="Versions"
              item={
                <div className="version-block">
                  <div className="active-version">
                    <div>todo active version</div>Updated: active version date
                  </div>
                  <VersionListContainerExample
                    items={snapshots}
                    className="version-dropdown"
                    activeDataset={activeDataset}
                    dateModified={dateModified}
                    selectedVersion={selectedVersion}
                    setSelectedVersion={setSelectedVersion}
                    setDeprecatedModalIsOpen={setDeprecatedModalIsOpen}
                  />
                </div>
              }
            />

            <MetaDataBlock
              heading="Uploaded by"
              item={
                <>
                  {dataset.uploader.name} on {dateAdded} - {dateAddedDifference}{' '}
                  ago
                </>
              }
            />

            {snapshots.length && (
              <MetaDataBlock
                heading="Last Updated"
                item={
                  <>
                    {dateModified} - {dateUpdatedDifference} ago
                  </>
                }
              />
            )}
            <MetaDataBlock
              heading={pluralize('Session', numSessions)}
              item={numSessions}
            />

            <MetaDataBlock
              heading={pluralize('Subject', summary.subjects.length)}
              item={summary.subjects.length}
            />

            <MetaDataBlock
              heading="Dataset DOI"
              item={
                description.DatasetDOI ||
                'Create a new snapshot to obtain a DOI for the snapshot.'
              }
            />
            <MetaDataBlock heading="License" item={description.License} />
            <MetaDataBlock
              heading="Acknowledgements"
              item={description.Acknowledgements}
            />
            <MetaDataBlock
              heading="How to Acknowledge"
              item={description.HowToAcknowledge}
            />
            <MetaDataBlock
              heading="Funding"
              item={description.Funding}
              isMarkdown={true}
              className="dmb-list"
            />

            <MetaDataBlock
              heading="References and Links"
              item={description.ReferencesAndLinks}
              isMarkdown={true}
              className="dmb-list"
            />

            <MetaDataBlock
              heading="Funding"
              item={description.EthicsApprovals}
              isMarkdown={true}
              className="dmb-list"
            />
          </>
        )}
        renderValidationBlock={() => (
          <>
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
                        gitHash={dataset.draft.head}
                      />
                    </span>
                  </div>
                </Dropdown>
              </div>
            </div>
          </>
        )}
        renderHeader={() => (
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
                          <div className="label">
                            {summary.modalities[0].substr(0, 4)}
                          </div>
                        </div>
                      </a>
                      {description.Name}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        renderAlert={() => (
          <>
            {isPublic && (
              <div className="dataset-header-alert">
                This dataset has not been published!
                <a href="">Publish the Dataset</a> to make all snapshots
                available publicly.
              </div>
            )}
          </>
        )}
        renderHeaderMeta={() => (
          <div className="dataset-header-meta">
            <span>OpenNeuro Accession Number:</span> {datasetId}
            <span>Files:</span> {summary.totalFiles}
            <span>Size:</span> {bytes(summary.size)}
          </div>
        )}
        renderToolButtons={() => (
          <div className="dataset-tool-buttons">
            <Tooltip tooltip="Publish the dataset publicly" flow="right">
              <Button
                className="dataset-tool"
                onClick={() => goToToolPath(history, rootPath, 'publish')}
                label="Publish"
                icon="fa fa-globe"
              />
            </Tooltip>
            <Tooltip tooltip="Share this dataset with collaborators" flow="up">
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
        )}
        renderReadMe={() => (
          <MetaDataBlock
            heading="README"
            item={
              <ReadMore
                id="readme"
                expandLabel="Read More"
                collapseabel="Collapse">
                <Markdown>
                  {dataset.draft.readme == null ? 'N/A' : dataset.draft.readme}
                </Markdown>
              </ReadMore>
            }
            className="dataset-readme markdown-body"
          />
        )}
      />
      <Modal
        isOpen={deprecatedmodalIsOpen}
        toggle={() => setDeprecatedModalIsOpen(prevIsOpen => !prevIsOpen)}
        closeText={'close'}
        className="deprecated-modal">
        <p>
          You have selected a deprecated version. The author of the dataset does
          not recommend this specific version.
        </p>
      </Modal>
    </>
  )
}
