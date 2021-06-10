import React from 'react'
import Markdown from 'markdown-to-jsx'
import { useLocation } from 'react-router-dom'

import pluralize from 'pluralize'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import { VersionListContainerExample } from './VersionListContainerExample'
import { DatasetPage } from './DatasetPage'
import { Button } from '../button/Button'
import { Tooltip } from '../tooltip/Tooltip'

import { ReadMore } from '../read-more/ReadMore'
import { MetaDataBlock } from './MetaDataBlock'
import { BrainLifeButton } from './BrainLifeButton'

import { ValidationBlock } from './ValidationBlock'

import { CloneDropdown } from './CloneDropdown'
import { DatasetHeader } from './DatasetHeader'
import { DatasetAlert } from './DatasetAlert'
import { DatasetHeaderMeta } from './DatasetHeaderMeta'
import { DeprecatedModal } from './DeprecatedModal'

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

  const summary = dataset.draft.summary
  const description = dataset.draft.description
  const datasetId = dataset.id
  const isPublic = dataset.public === true
  const numSessions = summary.sessions.length > 0 ? summary.sessions.length : 1

  const dateAdded = formatDate(dataset.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(dataset.created))
  const dateModified = formatDate(dataset.draft.modified)
  const dateUpdatedDifference = formatDistanceToNow(
    parseISO(dataset.draft.modified),
  )

  const rootPath = activeDataset
    ? `/datasets/${datasetId}/versions/${activeDataset}`
    : `/datasets/${datasetId}`

  const goToToolPath = (history, rootPath, path) => {
    history.push(`${rootPath}/${path}`)
  }

  //TODO setup  Redirect, Errorboundry, and Edit functionality
  //TODO deprecated needs to be added to the dataset snapshot obj and an admin needs to be able to say a version is deprecated somehow.
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
                  <VersionListContainerExample
                    items={dataset.snapshots}
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

            {dataset.snapshots.length && (
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
        renderBrainLifeButton={() => (
          <BrainLifeButton
            datasetId={datasetId}
            onBrainlife={dataset.onBrainlife}
          />
        )}
        renderValidationBlock={() => <ValidationBlock />}
        renderCloneDropdown={() => (
          <CloneDropdown datasetId={datasetId} gitHash={dataset.draft.head} />
        )}
        renderHeader={() => (
          <DatasetHeader
            pageHeading={description.Name}
            modality={summary.modalities[0]}
          />
        )}
        renderAlert={() => <>{isPublic && <DatasetAlert />}</>}
        renderHeaderMeta={() => (
          <DatasetHeaderMeta
            size={summary.size}
            totalFiles={summary.totalFiles}
            datasetId={datasetId}
          />
        )}
        renderToolButtons={() => (
          <>
            <Tooltip tooltip="Publish the dataset publicly" flow="up">
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
          </>
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
        renderDeprecatedModal={() => (
          <DeprecatedModal
            isOpen={deprecatedmodalIsOpen}
            toggle={() => setDeprecatedModalIsOpen(prevIsOpen => !prevIsOpen)}
            closeText={'close'}
            className="deprecated-modal">
            <p>
              You have selected a deprecated version. The author of the dataset
              does not recommend this specific version.
            </p>
          </DeprecatedModal>
        )}
      />
    </>
  )
}
