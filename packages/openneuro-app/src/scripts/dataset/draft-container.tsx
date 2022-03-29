import React from 'react'
import Markdown from 'markdown-to-jsx'
import { useLocation, Redirect } from 'react-router-dom'
import pluralize from 'pluralize'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'

import Validation from '../validation/validation.jsx'
import Files from './files'
import { config } from '../config'
import {
  getUnexpiredProfile,
  hasEditPermissions,
  hasDatasetAdminPermissions,
} from '../authentication/profile'
import { useCookies } from 'react-cookie'
import Comments from './comments/comments.jsx'
import { DatasetAlertDraft } from './fragments/dataset-alert-draft'
import {
  MetaDataBlock,
  ModalitiesMetaDataBlock,
  BrainLifeButton,
  ValidationBlock,
  CloneDropdown,
  DatasetHeader,
  DatasetHeaderMeta,
  DatasetGitAccess,
  VersionList,
  DatasetTools,
} from '@openneuro/components/dataset'
import { ReadMore } from '@openneuro/components/read-more'

import { FollowDataset } from './mutations/follow'
import { StarDataset } from './mutations/star'

import EditDescriptionField from './fragments/edit-description-field.jsx'
import EditDescriptionList from './fragments/edit-description-list.jsx'
import { DOILink } from './fragments/doi-link'

export interface DraftContainerProps {
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
const DraftContainer: React.FC<DraftContainerProps> = ({ dataset }) => {
  const location = useLocation()
  const activeDataset = snapshotVersion(location) || 'draft'

  const [selectedVersion, setSelectedVersion] = React.useState(activeDataset)

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

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const isAdmin = profile?.admin
  const hasEdit =
    hasEditPermissions(dataset.permissions, profile?.sub) || isAdmin
  const hasDraftChanges =
    dataset.snapshots.length === 0 ||
    dataset.draft.head !==
      dataset.snapshots[dataset.snapshots.length - 1].hexsha
  const isDatasetAdmin =
    hasDatasetAdminPermissions(dataset.permissions, profile?.sub) || isAdmin
  const modality: string = summary?.modalities[0] || ''

  return (
    <>
      {dataset.snapshots && !hasEdit && (
        <Redirect
          to={`/datasets/${dataset.id}/versions/${
            dataset.snapshots.length &&
            dataset.snapshots[dataset.snapshots.length - 1].tag
          }`}
        />
      )}
      <div
        className={`dataset dataset-draft dataset-page dataset-page-${modality?.toLowerCase()}`}>
        <DatasetHeader
          pageHeading={description.Name}
          modality={modality}
          renderEditor={() => (
            <EditDescriptionField
              datasetId={datasetId}
              field="Name"
              rows={2}
              description={description.Name}
              editMode={hasEdit}>
              {description.Name}
            </EditDescriptionField>
          )}
        />
        <DatasetAlertDraft
          isPrivate={!dataset.public}
          datasetId={dataset.id}
          hasDraftChanges={hasDraftChanges}
          hasSnapshot={dataset.snapshots.length !== 0}
        />
        <div className="container">
          <div className="grid grid-between dataset-header-meta">
            <div className="col col-8 col-lg">
              {summary && (
                <DatasetHeaderMeta
                  size={dataset.draft.size}
                  totalFiles={summary.totalFiles}
                  datasetId={datasetId}
                />
              )}
            </div>
            <div className="col follow-bookmark">
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
            </div>
          </div>
        </div>
        <div className="container">
          <div className="grid grid-between">
            <div className="col col-lg col-8">
              <div className="dataset-validation">
                <ValidationBlock>
                  <Validation
                    datasetId={dataset.id}
                    issues={dataset.draft.issues}
                  />
                </ValidationBlock>
                <BrainLifeButton
                  datasetId={datasetId}
                  onBrainlife={dataset.onBrainlife}
                />
                <CloneDropdown
                  gitAccess={
                    <DatasetGitAccess
                      hasEdit={hasEdit}
                      configGithub={config.github}
                      configUrl={config.url}
                      worker={dataset.worker}
                      datasetId={datasetId}
                      gitHash={dataset.draft.head}
                    />
                  }
                />
              </div>
              <div className="dataset-tool-buttons">
                <DatasetTools
                  hasEdit={hasEdit}
                  isPublic={dataset.public}
                  datasetId={datasetId}
                  isAdmin={isAdmin}
                  hasSnapshot={dataset.snapshots.length !== 0}
                  isDatasetAdmin={isDatasetAdmin}
                />
              </div>
              <ReadMore
                fileTree={true}
                id="collapse-tree"
                expandLabel="Expand File Tree"
                collapseLabel="Collapse File Tree">
                <Files
                  datasetId={datasetId}
                  snapshotTag={null}
                  datasetName={dataset.draft.description.Name}
                  files={dataset.draft.files}
                  editMode={hasEdit}
                  datasetPermissions={dataset.permissions}
                />
              </ReadMore>
              <MetaDataBlock
                heading="README"
                className="dataset-readme markdown-body"
                item={dataset.draft.readme}
                renderEditor={() => (
                  <EditDescriptionField
                    datasetId={datasetId}
                    field="readme"
                    rows={12}
                    description={dataset.draft.readme}
                    editMode={hasEdit}>
                    <ReadMore
                      id="readme"
                      expandLabel="Read More"
                      collapseLabel="Collapse">
                      <Markdown>{dataset.draft.readme || 'N/A'}</Markdown>
                    </ReadMore>
                  </EditDescriptionField>
                )}
              />
              <Comments
                datasetId={dataset.id}
                uploader={dataset.uploader}
                comments={dataset.comments}
              />
            </div>
            <div className="col sidebar">
              {' '}
              <EditDescriptionList
                className="dmb-inline-list"
                datasetId={datasetId}
                field="Authors"
                heading="Authors"
                description={description.Authors}
                editMode={hasEdit}>
                {description?.Authors?.length ? description.Authors : ['N/A']}
              </EditDescriptionList>
              {summary && (
                <ModalitiesMetaDataBlock
                  items={summary.modalities}
                  className="dmb-modalities"
                />
              )}
              <MetaDataBlock
                heading={dataset.snapshots.length ? 'Versions' : 'Version'}
                item={
                  <div className="version-block">
                    <VersionList
                      datasetId={datasetId}
                      hasEdit={hasEdit}
                      items={dataset.snapshots}
                      className="version-dropdown"
                      activeDataset={activeDataset}
                      dateModified={dateModified}
                      selected={selectedVersion}
                      setSelected={setSelectedVersion}
                    />
                  </div>
                }
              />
              {summary && (
                <MetaDataBlock
                  heading="Tasks"
                  item={summary.tasks.length ? summary.tasks.join(', ') : 'N/A'}
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
                      heading={pluralize(
                        'Radiotracer',
                        summary.pet?.TracerName,
                      )}
                      item={
                        summary.pet?.TracerName
                          ? summary.pet?.TracerName
                          : 'N/A'
                      }
                    />
                  </>
                ))}
              <MetaDataBlock
                heading="Uploaded by"
                item={
                  <>
                    {dataset.uploader.name} on {dateAdded} -{' '}
                    {dateAddedDifference} ago
                  </>
                }
              />
              {dataset.snapshots?.length ? (
                <MetaDataBlock
                  heading="Last Updated"
                  item={
                    <>
                      {dateModified} - {dateUpdatedDifference} ago
                    </>
                  }
                />
              ) : null}
              <MetaDataBlock heading="Sessions" item={numSessions} />
              <>
                {summary && (
                  <MetaDataBlock
                    heading="Participants"
                    item={summary.subjects.length}
                  />
                )}
              </>
              <MetaDataBlock
                heading="Dataset DOI"
                item={
                  <DOILink DOI={description.DatasetDOI} datasetId={datasetId} />
                }
              />
              <MetaDataBlock heading="License" item={description.License} />
              <MetaDataBlock
                heading="Acknowledgements"
                item={description.Acknowledgements}
                renderEditor={() => (
                  <EditDescriptionField
                    datasetId={datasetId}
                    field="Acknowledgements"
                    rows={2}
                    description={description.Acknowledgements}
                    editMode={hasEdit}>
                    <Markdown>{description.Acknowledgements || 'N/A'}</Markdown>
                  </EditDescriptionField>
                )}
              />
              <MetaDataBlock
                heading="How to Acknowledge"
                item={description.HowToAcknowledge}
                renderEditor={() => (
                  <EditDescriptionField
                    datasetId={datasetId}
                    field="HowToAcknowledge"
                    rows={2}
                    description={description.HowToAcknowledge}
                    editMode={hasEdit}>
                    <Markdown>{description.HowToAcknowledge || 'N/A'}</Markdown>
                  </EditDescriptionField>
                )}
              />
              <EditDescriptionList
                className="dmb-list"
                datasetId={datasetId}
                field="Funding"
                heading="Funding"
                description={description.Funding}
                editMode={hasEdit}>
                {description.Funding?.length ? description.Funding : ['N/A']}
              </EditDescriptionList>
              <EditDescriptionList
                className="dmb-list"
                datasetId={datasetId}
                field="ReferencesAndLinks"
                heading="References and Links"
                description={description.ReferencesAndLinks}
                editMode={hasEdit}>
                {description.ReferencesAndLinks?.length
                  ? description.ReferencesAndLinks
                  : ['N/A']}
              </EditDescriptionList>
              <EditDescriptionList
                className="dmb-list"
                datasetId={datasetId}
                field="EthicsApprovals"
                heading="Ethics Approvals"
                description={description.EthicsApprovals}
                editMode={hasEdit}>
                {description.EthicsApprovals?.length
                  ? description.EthicsApprovals
                  : ['N/A']}
              </EditDescriptionList>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DraftContainer
