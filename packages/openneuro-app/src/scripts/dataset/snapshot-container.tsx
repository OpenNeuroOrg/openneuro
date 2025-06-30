import React from "react"
import Helmet from "react-helmet"
import { gql, useQuery } from "@apollo/client"
import { DatasetPageTabContainer } from "./routes/styles/dataset-page-tab-container"
import DatasetQueryContext from "../datalad/dataset/dataset-query-context.js"
import { Link, useLocation, useParams } from "react-router-dom"
import pluralize from "pluralize"
import { pageTitle } from "../resources/strings.js"
import { config } from "../config"
import DatasetCitation from "./fragments/dataset-citation.jsx"
import { DatasetAlertVersion } from "./fragments/dataset-alert-version"
import { DatasetAlertPrivate } from "./fragments/dataset-alert"
import { AnalyzeDropdown } from "./components/AnalyzeDropdown"
import { CloneDropdown } from "./components/CloneDropdown"
import { DatasetGitAccess } from "./components/DatasetGitAccess"
import { DatasetHeader } from "./components/DatasetHeader"
import { DatasetTools } from "./components/DatasetTools"
import { MetaDataBlock } from "./components/MetaDataBlock"
import { MetaDataListBlock } from "./components/MetaDataListBlock"
import { ModalitiesMetaDataBlock } from "./components/ModalitiesMetaDataBlock"
import { ValidationBlock } from "./components/ValidationBlock"
import { VersionList } from "./components/VersionList"
import { Username } from "../users/username"
import { Loading } from "../components/loading/Loading"

import {
  getUnexpiredProfile,
  hasDatasetAdminPermissions,
  hasEditPermissions,
} from "../authentication/profile"
import { useCookies } from "react-cookie"

import { FollowDataset } from "./mutations/follow"
import { StarDataset } from "./mutations/star"

import { SNAPSHOT_FIELDS } from "../datalad/dataset/dataset-query-fragments.js"
import { DOILink } from "./fragments/doi-link"
import { TabRoutesSnapshot } from "./routes/tab-routes-snapshot"
import schemaGenerator from "../utils/json-ld.js"
import { FollowToggles } from "./common/follow-toggles"
import { DateDistance } from "../components/date-distance"

// Helper function for getting version from URL
const snapshotVersion = (location) => {
  const matches = location.pathname.match(/versions\/(.*?)(\/|$)/)
  return matches && matches[1]
}

type SnapshotContainerProps = {
  dataset
  snapshot
}

export const SnapshotContainer: React.FC<SnapshotContainerProps> = ({
  dataset,
  snapshot,
}) => {
  const location = useLocation()
  const activeDataset = snapshotVersion(location) || "draft"

  const [selectedVersion, setSelectedVersion] = React.useState(activeDataset)

  const summary = snapshot.summary
  const description = snapshot.description
  const datasetId = dataset.id

  const numSessions = summary && summary.sessions.length > 0
    ? summary.sessions.length
    : 1

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const isAdmin = profile?.admin
  const hasEdit = hasEditPermissions(dataset.permissions, profile?.sub) ||
    isAdmin
  const isDatasetAdmin =
    hasDatasetAdminPermissions(dataset.permissions, profile?.sub) || isAdmin
  const hasDraftChanges = dataset.snapshots.length === 0 ||
    dataset.draft.head !==
      dataset.snapshots[dataset.snapshots.length - 1].hexsha
  const modality: string = summary?.modalities[0] || ""
  const hasDerivatives = dataset?.derivatives.length > 0
  const isAnonymousReviewer = profile?.scopes?.includes("dataset:reviewer")
  return (
    <>
      <Helmet>
        <title>
          {description.Name} - {pageTitle}
        </title>
        <script type="application/ld+json">{schemaGenerator(snapshot)}</script>
      </Helmet>
      <div
        className={`dataset dataset-draft dataset-page dataset-page-${modality?.toLowerCase()}`}
      >
        {summary && (
          <DatasetHeader
            pageHeading={description.Name}
            modality={summary?.modalities[0]}
            datasetHeaderTools={
              <div className="dataset-tool-buttons">
                <DatasetTools
                  hasEdit={hasEdit}
                  isPublic={dataset.public}
                  datasetId={datasetId}
                  snapshotId={snapshot.tag}
                  isAdmin={isAdmin}
                  isDatasetAdmin={isDatasetAdmin}
                  hasDerivatives={hasDerivatives}
                />
              </div>
            }
            datasetUserActions={
              <FollowToggles>
                <FollowDataset
                  profile={profile !== null}
                  datasetId={dataset.id}
                  following={dataset.following}
                  followers={dataset.followers.length}
                />
                <StarDataset
                  profile={profile !== null}
                  datasetId={dataset.id}
                  starred={dataset.starred}
                  stars={dataset.stars.length}
                />
              </FollowToggles>
            }
          />
        )}
        {!dataset.public && isDatasetAdmin && (
          <DatasetAlertPrivate
            datasetId={dataset.id}
            hasDraftChanges={hasDraftChanges}
          />
        )}
        {snapshot?.deprecated && (
          <DatasetAlertVersion
            datasetId={dataset.id}
            tag={snapshot.tag}
            reason={snapshot.deprecated.reason}
            hasEdit={hasEdit}
          />
        )}
        <div className="dataset-content container">
          <div className="grid grid-between">
            <div className="col col-lg col-8">
              <div className="dataset-validation">
                <ValidationBlock
                  datasetId={datasetId}
                  version={snapshot.tag}
                  issuesStatus={snapshot.issuesStatus}
                  validation={snapshot.validation}
                />
                <AnalyzeDropdown
                  datasetId={datasetId}
                  snapshotVersion={snapshot.tag}
                />
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
              </div>
              <DatasetPageTabContainer>
                <TabRoutesSnapshot dataset={dataset} snapshot={snapshot} />
              </DatasetPageTabContainer>
            </div>
            <div className="col sidebar">
              <MetaDataBlock
                heading="OpenNeuro Accession Number"
                item={datasetId}
              />
              {/* TODO: update this to work with edit mutation and move to new component */}
              <MetaDataBlock
                heading="Contributors"
                item={snapshot.contributors?.length
                  ? snapshot.contributors.map((contributor, index) => {
                    const cleanORCID = contributor.id
                      ? contributor.id.replace(/^ORCID:/, "")
                      : null
                    return (
                      <React.Fragment key={index}>
                        {contributor.name || "Unknown Contributor"}
                        {cleanORCID && (
                          <>
                            {" "}
                            (<a
                              href={`https://orcid.org/${cleanORCID}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {cleanORCID}
                            </a>)
                          </>
                        )}
                        {index < snapshot.contributors.length - 1 && <br />}
                      </React.Fragment>
                    )
                  })
                  : "N/A"}
              />

              <MetaDataBlock
                heading="Authors"
                item={description?.Authors?.length
                  ? description.Authors.join(", ")
                  : "N/A"}
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
                      dateModified={snapshot.created}
                      selected={selectedVersion}
                      setSelected={setSelectedVersion}
                    />
                  </div>
                }
              />
              {summary && (
                <MetaDataBlock
                  heading="Tasks"
                  item={summary.tasks.length ? summary.tasks.join(", ") : "N/A"}
                  className="dmb-inline-list"
                />
              )}
              {summary?.modalities.includes("pet") ||
                summary?.modalities.includes("Pet") ||
                (summary?.modalities.includes("PET") && (
                  <>
                    <MetaDataBlock
                      heading={pluralize("Target", summary.pet?.BodyPart)}
                      item={summary.pet?.BodyPart}
                    />
                    <MetaDataBlock
                      heading={pluralize(
                        "Scanner Manufacturer",
                        summary.pet?.ScannerManufacturer,
                      )}
                      item={summary.pet?.ScannerManufacturer
                        ? summary.pet?.ScannerManufacturer
                        : "N/A"}
                    />

                    <MetaDataBlock
                      heading={pluralize(
                        "Scanner Model",
                        summary.pet?.ScannerManufacturersModelName,
                      )}
                      item={summary.pet?.ScannerManufacturersModelName
                        ? summary.pet?.ScannerManufacturersModelName
                        : "N/A"}
                    />
                    <MetaDataBlock
                      heading={pluralize(
                        "Radionuclide",
                        summary.pet?.TracerRadionuclide,
                      )}
                      item={summary.pet?.TracerRadionuclide
                        ? summary.pet?.TracerRadionuclide
                        : "N/A"}
                    />
                    <MetaDataBlock
                      heading={pluralize(
                        "Radiotracer",
                        summary.pet?.TracerName,
                      )}
                      item={summary.pet?.TracerName
                        ? summary.pet?.TracerName
                        : "N/A"}
                    />
                  </>
                ))}
              {!isAnonymousReviewer && (
                <MetaDataBlock
                  heading="Uploaded by"
                  item={
                    <>
                      <Username user={dataset.uploader} /> on{" "}
                      <DateDistance date={dataset.created} />
                    </>
                  }
                />
              )}

              {dataset.snapshots.length && (
                <MetaDataBlock
                  heading="Last Updated"
                  item={<DateDistance date={snapshot.created} />}
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
                item={
                  <DOILink DOI={description.DatasetDOI} datasetId={datasetId} />
                }
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
              <MetaDataListBlock
                heading="Funding"
                item={description.Funding}
                className="dmb-list"
              />

              <MetaDataListBlock
                heading="References and Links"
                item={description.ReferencesAndLinks}
                className="dmb-list"
              />

              <MetaDataListBlock
                heading="Ethics Approvals"
                item={description.EthicsApprovals}
                className="dmb-list"
              />
            </div>
          </div>
        </div>
      </div>
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
}

const SnapshotLoader: React.FC<SnapshotLoaderProps> = ({ dataset }) => {
  const { tag } = useParams()
  const { loading, error, data, fetchMore, stopPolling, startPolling } =
    useQuery(getSnapshotDetails, {
      variables: {
        datasetId: dataset.id,
        tag,
      },
      errorPolicy: "all",
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
          stopPolling,
          startPolling,
        }}
      >
        <SnapshotContainer dataset={dataset} snapshot={data.snapshot} />
      </DatasetQueryContext.Provider>
    )
  }
}
export default SnapshotLoader
