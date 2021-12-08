import React from 'react'
import { gql, useQuery } from '@apollo/client'
import DatasetQueryContext from '../../datalad/dataset/dataset-query-context.js'
import Markdown from 'markdown-to-jsx'
import { Link, useLocation } from 'react-router-dom'
import pluralize from 'pluralize'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'

import Files from './files'
import Validation from '../validation/validation.jsx'
import { config } from '../../config'
import Comments from './comments/comments.jsx'
import DatasetCitation from './fragments/dataset-citation.jsx'
import { DatasetAlertVersion } from './fragments/dataset-alert-version'

import {
  ModalitiesMetaDataBlock,
  MetaDataBlock,
  BrainLifeButton,
  ValidationBlock,
  CloneDropdown,
  DatasetHeader,
  DatasetHeaderMeta,
  DatasetPage,
  DatasetGitAccess,
  VersionList,
  DatasetTools,
} from '@openneuro/components/dataset'
import { Loading } from '@openneuro/components/loading'

import {
  getUnexpiredProfile,
  hasEditPermissions,
  hasDatasetAdminPermissions,
} from '../authentication/profile'
import { useCookies } from 'react-cookie'

import { ReadMore } from '@openneuro/components/read-more'

import { FollowDataset } from './mutations/follow'
import { StarDataset } from './mutations/star'

import { SNAPSHOT_FIELDS } from '../../datalad/dataset/dataset-query-fragments.js'
import { DOILink } from './fragments/doi-link'

const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]

// Helper function for getting version from URL
const snapshotVersion = location => {
  const matches = location.pathname.match(/versions\/(.*?)(\/|$)/)
  return matches && matches[1]
}

type SnapshotContainerProps = {
  dataset
  tag: string
  snapshot
}

const SnapshotContainer: React.FC<SnapshotContainerProps> = ({
  dataset,
  tag,
  snapshot,
}) => {
  const location = useLocation()
  const activeDataset = snapshotVersion(location) || 'draft'

  const [selectedVersion, setSelectedVersion] = React.useState(activeDataset)

  const summary = snapshot.summary
  const description = snapshot.description
  const datasetId = dataset.id

  const numSessions =
    summary && summary.sessions.length > 0 ? summary.sessions.length : 1

  const dateAdded = formatDate(dataset.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(dataset.created))
  const dateModified = formatDate(snapshot.created)
  const dateUpdatedDifference = formatDistanceToNow(parseISO(snapshot.created))

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const isAdmin = profile?.admin
  const hasEdit =
    hasEditPermissions(dataset.permissions, profile?.sub) || isAdmin
  const isDatasetAdmin =
    hasDatasetAdminPermissions(dataset.permissions, profile?.sub) || isAdmin

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
        renderAlert={() => (
          <>
            {snapshot?.deprecated && (
              <DatasetAlertVersion
                datasetId={dataset.id}
                tag={snapshot.tag}
                reason={snapshot.deprecated.reason}
                hasEdit={hasEdit}
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
        renderValidationBlock={() => (
          <ValidationBlock>
            <Validation datasetId={dataset.id} issues={snapshot.issues} />
          </ValidationBlock>
        )}
        renderCloneDropdown={() => (
          <CloneDropdown
            gitAccess={
              <DatasetGitAccess
                hasEdit={hasEdit}
                configGithub={config.github}
                configUrl={config.url}
                worker={dataset.worker}
                datasetId={datasetId}
                gitHash={snapshot.hexsha}
              />
            }
          />
        )}
        renderToolButtons={() => (
          <DatasetTools
            hasEdit={hasEdit}
            isPublic={dataset.public}
            datasetId={datasetId}
            isSnapshot={true}
            isAdmin={isAdmin}
            isDatasetAdmin={isDatasetAdmin}
          />
        )}
        renderFiles={() => (
          <ReadMore
            fileTree={true}
            id="collapse-tree"
            expandLabel="Read More"
            collapseLabel="Collapse">
            <Files
              datasetId={datasetId}
              snapshotTag={snapshot.tag}
              datasetName={description.Name}
              files={snapshot.files}
              editMode={false}
              datasetPermissions={dataset.permissions}
            />
          </ReadMore>
        )}
        renderReadMe={() => (
          <MetaDataBlock
            heading="README"
            item={
              <ReadMore
                id="readme"
                expandLabel="Read More"
                collapseLabel="Collapse">
                <Markdown>
                  {snapshot.readme == null ? 'N/A' : snapshot.readme}
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
              item={
                description.Authors.length
                  ? description.Authors.join(', ')
                  : 'N/A'
              }
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
                  <VersionList
                    hasEdit={hasEdit}
                    datasetId={datasetId}
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
              item={<DOILink DOI={description.DatasetDOI} />}
            />
            <MetaDataBlock heading="License" item={description.License} />

            <MetaDataBlock
              heading="How To Cite"
              item={
                <>
                  <DatasetCitation snapshot={snapshot} />
                  <h5>
                    <Link to="/cite">More citation info</Link>
                  </h5>
                </>
              }
            />

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
              className="dmb-list"
            />

            <MetaDataBlock
              heading="References and Links"
              item={description.ReferencesAndLinks}
              className="dmb-list"
            />

            <MetaDataBlock
              heading="Ethics Approvals"
              item={description.EthicsApprovals}
              className="dmb-list"
            />
          </>
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

const getSnapshotDetails = gql`
  query snapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      ...SnapshotFields
    }
  }
  ${SNAPSHOT_FIELDS}
`

export interface SnapshotLoaderProps {
  dataset
  tag: string
}

const SnapshotLoader: React.FC<SnapshotLoaderProps> = ({ dataset, tag }) => {
  const { loading, error, data, fetchMore } = useQuery(getSnapshotDetails, {
    variables: {
      datasetId: dataset.id,
      tag,
    },
    errorPolicy: 'all',
  })
  if (loading) {
    return (
      <div className="loading-dataset">
        <Loading />
        Loading Dataset
      </div>
    )
  } else if (error) {
    throw new Error(error.toString())
  } else {
    return (
      <DatasetQueryContext.Provider
        value={{
          datasetId: dataset.id,
          fetchMore,
          error: null,
        }}>
        <SnapshotContainer
          dataset={dataset}
          tag={tag}
          snapshot={data.snapshot}
        />
      </DatasetQueryContext.Provider>
    )
  }
}
export default SnapshotLoader
