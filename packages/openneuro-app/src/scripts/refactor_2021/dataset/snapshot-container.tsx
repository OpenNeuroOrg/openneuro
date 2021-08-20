import React from 'react'
import Markdown from 'markdown-to-jsx'
import { Link, useLocation } from 'react-router-dom'
import pluralize from 'pluralize'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'

import Validation from '../validation/validation.jsx'

import {
  ModalitiesMetaDataBlock,
  MetaDataBlock,
  BrainLifeButton,
  ValidationBlock,
  CloneDropdown,
  DatasetHeader,
  DatasetAlert,
  DatasetHeaderMeta,
  DatasetPage,
  DatasetGitAccess,
  VersionListContainerExample,
} from '@openneuro/components/dataset'
import { Modal } from '@openneuro/components/modal'
import { Icon } from '@openneuro/components/icon'
import { Tooltip } from '@openneuro/components/tooltip'
import { ReadMore } from '@openneuro/components/read-more'
import { CountToggle } from '@openneuro/components/count-toggle'

export interface SnapshotContainerProps {
  dataset
  tag?: string
}

const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]

// Helper function for getting version from URL
const snapshotVersion = location => {
  const matches = location.pathname.match(/versions\/(.*?)(\/|$)/)
  return matches && matches[1]
}
const SnapshotContainer: React.FC<SnapshotContainerProps> = ({ dataset }) => {
  const [bookmarked, showBookmarked] = React.useState(false)
  const [bookmarkedCount, setBookmarkedCount] = React.useState(1)
  const [followed, showFollowed] = React.useState(false)
  const [followedCount, setFollowedCount] = React.useState(1)

  //TODO hook up follow and bookmark
  const toggleBookmarkClick = () => {
    setBookmarkedCount(bookmarkedCount === 1 ? 2 : 1)
    showBookmarked(!bookmarked)
  }
  const toggleFollowedClick = () => {
    setFollowedCount(followedCount === 1 ? 2 : 1)
    showFollowed(!followed)
  }

  const location = useLocation()
  const activeDataset = snapshotVersion(location) || 'draft'

  const [selectedVersion, setSelectedVersion] = React.useState(activeDataset)
  const [deprecatedmodalIsOpen, setDeprecatedModalIsOpen] =
    React.useState(false)

  const summary = dataset.draft.summary
  const description = dataset.draft.description
  const datasetId = dataset.id
  const isPublic = dataset.public === true
  const numSessions =
    summary && summary.sessions.length > 0 ? summary.sessions.length : 1

  const dateAdded = formatDate(dataset.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(dataset.created))
  const dateModified = formatDate(dataset.draft.modified)
  const dateUpdatedDifference = formatDistanceToNow(
    parseISO(dataset.draft.modified),
  )

  const rootPath =
    activeDataset !== 'draft'
      ? `/datasets/${datasetId}/versions/${activeDataset}`
      : `/datasets/${datasetId}`

  //TODO setup  Redirect, Errorboundry, and Edit functionality
  //TODO deprecated needs to be added to the dataset snapshot obj and an admin needs to be able to say a version is deprecated somehow.
  //TODO Setup hasEdit
  const hasEdit = true
  //TODO Setup profile - isloggedin
  const profile = true
  // (user && user.admin) ||
  // hasEditPermissions(dataset.permissions, user && user.sub)
  return (
    <>
      <DatasetPage
        modality={summary.modalities[0]}
        renderHeader={() => (
          <>
            {summary && (
              <DatasetHeader
                pageHeading={description.Name}
                modality={summary.modalities[0]}
              />
            )}
          </>
        )}
        renderAlert={() => (
          <>{isPublic ? <DatasetAlert rootPath={rootPath} /> : null}</>
        )}
        renderHeaderMeta={() => (
          <>
            {summary && (
              <DatasetHeaderMeta
                size={summary.size}
                totalFiles={summary.totalFiles}
                datasetId={datasetId}
              />
            )}
          </>
        )}
        renderFollowBookmark={() => (
          <>
            <CountToggle
              label="Follow"
              icon="fa-thumbtack"
              disabled={profile ? false : true}
              toggleClick={toggleBookmarkClick}
              tooltip="hello Tip"
              clicked={bookmarked}
              showClicked={showBookmarked}
              count={bookmarkedCount}
            />
            <CountToggle
              label="Bookmark"
              icon="fa-bookmark"
              disabled={profile ? false : true}
              toggleClick={toggleFollowedClick}
              tooltip="hello Tip"
              clicked={followed}
              showClicked={showFollowed}
              count={followedCount}
            />
          </>
        )}
        renderBrainLifeButton={() => (
          <BrainLifeButton
            datasetId={datasetId}
            onBrainlife={dataset.onBrainlife}
          />
        )}
        renderValidationBlock={() => (
          <ValidationBlock>
            <Validation datasetId={dataset.id} issues={dataset.draft.issues} />
          </ValidationBlock>
        )}
        renderCloneDropdown={() => (
          <CloneDropdown
            gitAccess={
              <DatasetGitAccess
                //TODO add worker and configURL
                configUrl="configurl"
                worker="worker"
                datasetId={datasetId}
                gitHash={dataset.draft.head}
              />
            }
          />
        )}
        renderToolButtons={() => (
          <>
            <Tooltip tooltip="Publish the dataset publicly" flow="up">
              <Link className="dataset-tool" to={rootPath + '/publish'}>
                <Icon icon="fa fa-globe" label="Publish" />
              </Link>
            </Tooltip>
            <Tooltip tooltip="Share this dataset with collaborators" flow="up">
              <Link className="dataset-tool" to={rootPath + '/share'}>
                <Icon icon="fa fa-user" label="Share" />
              </Link>
            </Tooltip>

            <Tooltip tooltip="Create a new version of the dataset" flow="up">
              <Link className="dataset-tool" to={rootPath + '/snapshot'}>
                <Icon icon="fa fa-camera" label="Snapshot" />
              </Link>
            </Tooltip>
            <span>
              <Link className="dataset-tool" to={rootPath + '/download'}>
                <Icon icon="fa fa-download" label="Download" />
              </Link>
            </span>
            <Tooltip
              wrapText={true}
              tooltip="A form to describe your dataset (helps colleagues discover your dataset)"
              flow="up">
              <Link className="dataset-tool" to={rootPath + '/metadata'}>
                <Icon icon="fa fa-file-code" label="Metadata" />
              </Link>
            </Tooltip>
            <Tooltip tooltip="Remove your dataset from OpenNeuro" flow="up">
              <Link className="dataset-tool" to={rootPath + '/delete'}>
                <Icon icon="fa fa-trash" label="Delete" />
              </Link>
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
        renderSidebar={() => (
          <>
            <MetaDataBlock
              heading="Authors"
              item={description.Authors}
              isMarkdown={true}
              className="dmb-inline-list"
            />
            <>
              {summary && (
                <>
                  <ModalitiesMetaDataBlock
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
                </>
              )}
            </>

            <MetaDataBlock
              heading="Versions"
              item={
                <div className="version-block">
                  <VersionListContainerExample
                    rootPath={rootPath}
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

            <>
              {summary && (
                <MetaDataBlock
                  heading={pluralize('Subject', summary.subjects.length)}
                  item={summary.subjects.length}
                />
              )}
            </>

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
        renderDeprecatedModal={() => (
          <Modal
            isOpen={deprecatedmodalIsOpen}
            toggle={() => setDeprecatedModalIsOpen(prevIsOpen => !prevIsOpen)}
            closeText={'close'}
            className="deprecated-modal">
            <p>
              You have selected a deprecated version. The author of the dataset
              does not recommend this specific version.
            </p>
          </Modal>
        )}
      />
    </>
  )
}
export default SnapshotContainer
