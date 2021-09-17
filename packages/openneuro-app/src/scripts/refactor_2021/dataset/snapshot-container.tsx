import React from 'react'
import Markdown from 'markdown-to-jsx'
import { Link, useLocation } from 'react-router-dom'
import pluralize from 'pluralize'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'

import Validation from '../validation/validation.jsx'
import { config } from '../../config'
import Comments from './comments/comments.jsx'

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
  DatasetTools,
} from '@openneuro/components/dataset'
import {
  getUnexpiredProfile,
  hasEditPermissions,
} from '../authentication/profile'
import { useCookies } from 'react-cookie'
import { Modal } from '@openneuro/components/modal'

import { ReadMore } from '@openneuro/components/read-more'

import { FollowDataset } from './mutations/follow'
import { StarDataset } from './mutations/star'

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
  const location = useLocation()
  const activeDataset = snapshotVersion(location) || 'draft'

  const [selectedVersion, setSelectedVersion] = React.useState(activeDataset)
  const [deprecatedmodalIsOpen, setDeprecatedModalIsOpen] =
    React.useState(false)

  const summary = dataset.draft.summary
  const description = dataset.draft.description
  const datasetId = dataset.id

  const numSessions =
    summary && summary.sessions.length > 0 ? summary.sessions.length : 1

  const dateAdded = formatDate(dataset.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(dataset.created))
  const dateModified = formatDate(dataset.draft.modified)
  const dateUpdatedDifference = formatDistanceToNow(
    parseISO(dataset.draft.modified),
  )
  const isSnapshot = activeDataset !== 'draft'
  const rootPath = isSnapshot
    ? `/datasets/${datasetId}/versions/${activeDataset}`
    : `/datasets/${datasetId}`

  //TODO deprecated needs to be added to the dataset snapshot obj and an admin needs to be able to say a version is deprecated somehow.
  const isPublic = dataset.public === true
  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const isAdmin = profile?.admin
  const hasEdit =
    hasEditPermissions(dataset.permissions, profile?.sub) || isAdmin
  const hasDraftChanges =
    dataset.snapshots.length === 0 ||
    dataset.draft.head !==
      dataset.snapshots[dataset.snapshots.length - 1].hexsha
  return (
    <>
      <DatasetPage
        modality={summary?.modalities[0]}
        renderHeader={() => (
          <>
            {summary && (
              <DatasetHeader
                pageHeading={description.Name}
                modality={summary?.modalities[0]}
              />
            )}
          </>
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
            <FollowDataset
              profile={profile}
              datasetId={dataset.id}
              following={dataset.following}
              followers={dataset.followers.length}
            />
            <StarDataset
              profile={profile}
              datasetId={dataset.id}
              starred={dataset.starred}
              stars={dataset.stars.length}
            />
          </>
        )}
        renderBrainLifeButton={() => (
          <BrainLifeButton
            datasetId={datasetId}
            onBrainlife={dataset.onBrainlife}
          />
        )}
        renderAlert={() => (
          <>
            {hasEdit && (
              <DatasetAlert
                isPrivate={!dataset.public}
                datasetId={dataset.id}
                hasDraftChanges={hasDraftChanges}
                hasSnapshot={!dataset.snapshots.length}
              />
            )}
          </>
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
                configUrl={config.url}
                worker={dataset.worker}
                datasetId={datasetId}
                gitHash={dataset.draft.head}
              />
            }
          />
        )}
        renderToolButtons={() => (
          <DatasetTools
            rootPath={`/datasets/${datasetId}`}
            hasEdit={hasEdit}
            isPublic={dataset.public}
            isSnapshot={isSnapshot}
          />
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
                <ModalitiesMetaDataBlock
                  items={summary?.modalities}
                  className="dmb-modalities"
                />
              )}
            </>

            <MetaDataBlock
              heading="Versions"
              item={
                <div className="version-block">
                  <VersionListContainerExample
                    hasEdit={hasEdit}
                    datasetId={datasetId}
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
            {summary && (
              <MetaDataBlock
                heading="Tasks"
                item={summary.tasks}
                isMarkdown={true}
                className="dmb-inline-list"
              />
            )}
            {summary?.modalities.includes('pet') ||
              summary?.modalities.includes('Pet') ||
              (summary?.modalities.includes('PET') && (
                <>
                  <MetaDataBlock
                    heading={pluralize('Target', summary.pet?.BodyPart)}
                    item={summary.pet?.BodyPart}
                  />
                  <MetaDataBlock
                    heading={pluralize(
                      'Scanner Manufacturer',
                      summary.pet?.ScannerManufacturer,
                    )}
                    item={
                      summary.pet?.ScannerManufacturer
                        ? summary.pet?.ScannerManufacturer
                        : 'N/A'
                    }
                  />

                  <MetaDataBlock
                    heading={pluralize(
                      'Scanner Model',
                      summary.pet?.ScannerManufacturersModelName,
                    )}
                    item={
                      summary.pet?.ScannerManufacturersModelName
                        ? summary.pet?.ScannerManufacturersModelName
                        : 'N/A'
                    }
                  />
                  <MetaDataBlock
                    heading={pluralize(
                      'Radionuclide',
                      summary.pet?.TracerRadionuclide,
                    )}
                    item={
                      summary.pet?.TracerRadionuclide
                        ? summary.pet?.TracerRadionuclide
                        : 'N/A'
                    }
                  />
                  <MetaDataBlock
                    heading={pluralize('Radiotracer', summary.pet?.TracerName)}
                    item={
                      summary.pet?.TracerName ? summary.pet?.TracerName : 'N/A'
                    }
                  />
                </>
              ))}

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
              isMarkdown={true}
              heading="Acknowledgements"
              item={description.Acknowledgements}
            />
            <MetaDataBlock
              isMarkdown={true}
              heading="How to Acknowledge"
              item={description.HowToAcknowledge}
            />
            <MetaDataBlock
              isMarkdown={true}
              heading="Funding"
              item={description.Funding}
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
        renderComments={() => (
          <Comments
            datasetId={dataset.id}
            uploader={dataset.uploader}
            comments={dataset.comments}
          />
        )}
      />
    </>
  )
}
export default SnapshotContainer
