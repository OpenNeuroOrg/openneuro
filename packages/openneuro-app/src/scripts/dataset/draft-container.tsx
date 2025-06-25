import React from "react"
import { Markdown } from "../utils/markdown"
import Helmet from "react-helmet"
import { Navigate, useLocation } from "react-router-dom"
import pluralize from "pluralize"
import { pageTitle } from "../resources/strings.js"

import { DatasetPageTabContainer } from "./routes/styles/dataset-page-tab-container"
import { config } from "../config"
import {
  getUnexpiredProfile,
  hasDatasetAdminPermissions,
  hasEditPermissions,
} from "../authentication/profile"
import { useCookies } from "react-cookie"
import { DatasetAlertDraft } from "./fragments/dataset-alert"
import { CloneDropdown } from "./components/CloneDropdown"
import { DatasetGitAccess } from "./components/DatasetGitAccess"
import { DatasetHeader } from "./components/DatasetHeader"
import { DatasetTools } from "./components/DatasetTools"
import { MetaDataBlock } from "./components/MetaDataBlock"
import { ModalitiesMetaDataBlock } from "./components/ModalitiesMetaDataBlock"
import { ValidationBlock } from "./components/ValidationBlock"
import { VersionList } from "./components/VersionList"
import { Username } from "../users/username"

import { FollowDataset } from "./mutations/follow"
import { StarDataset } from "./mutations/star"

import EditDescriptionField from "./fragments/edit-description-field.jsx"
import EditDescriptionList from "./fragments/edit-description-list.jsx"
import { DOILink } from "./fragments/doi-link"

import { TabRoutesDraft } from "./routes/tab-routes-draft"
import { FollowToggles } from "./common/follow-toggles"
import { DateDistance } from "../components/date-distance"

export interface DraftContainerProps {
  dataset
  tag?: string
}

// Helper function for getting version from URL
const snapshotVersion = (location) => {
  const matches = location.pathname.match(/versions\/(.*?)(\/|$)/)
  return matches && matches[1]
}
const DraftContainer: React.FC<DraftContainerProps> = ({ dataset }) => {
  const location = useLocation()
  const activeDataset = snapshotVersion(location) || "draft"

  const [selectedVersion, setSelectedVersion] = React.useState(activeDataset)
  const summary = dataset.draft.summary
  const description = dataset.draft.description
  const datasetId = dataset.id

  const numSessions = summary && summary.sessions.length > 0
    ? summary.sessions.length
    : 1

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const isAdmin = profile?.admin
  const hasEdit = hasEditPermissions(dataset.permissions, profile?.sub) ||
    isAdmin
  const hasDraftChanges = dataset.snapshots.length === 0 ||
    dataset.draft.head !==
      dataset.snapshots[dataset.snapshots.length - 1].hexsha
  const isDatasetAdmin =
    hasDatasetAdminPermissions(dataset.permissions, profile?.sub) || isAdmin
  const modality: string = summary?.modalities[0] || ""
  const hasDerivatives = dataset?.derivatives.length > 0

  return (
    <>
      <Helmet>
        <title>
          {description.Name} - {pageTitle}
        </title>
      </Helmet>
      {dataset.snapshots.length !== 0 &&
        dataset.snapshots[dataset.snapshots.length - 1].tag &&
        !hasEdit && (
        <Navigate
          to={`/datasets/${dataset.id}/versions/${
            dataset.snapshots[dataset.snapshots.length - 1].tag
          }`}
          replace
        />
      )}
      <div
        className={`dataset dataset-draft dataset-page dataset-page-${modality?.toLowerCase()}`}
      >
        <DatasetHeader
          pageHeading={description.Name}
          modality={summary?.modalities[0]}
          datasetHeaderTools={
            <div className="dataset-tool-buttons">
              <DatasetTools
                hasEdit={hasEdit}
                isPublic={dataset.public}
                datasetId={datasetId}
                isAdmin={isAdmin}
                isDatasetAdmin={isDatasetAdmin}
                hasDerivatives={hasDerivatives}
                hasSnapshot={dataset.snapshots.length !== 0}
              />
            </div>
          }
          renderEditor={() => (
            <>
              <EditDescriptionField
                datasetId={datasetId}
                field="Name"
                rows={2}
                description={description.Name}
                editMode={hasEdit}
              >
                {description.Name}
              </EditDescriptionField>
            </>
          )}
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
        <DatasetAlertDraft
          isPrivate={!dataset.public}
          datasetId={dataset.id}
          hasDraftChanges={hasDraftChanges}
          hasSnapshot={dataset.snapshots.length !== 0}
        />
        <div className="dataset-content container">
          <div className="grid grid-between">
            <div className="col col-lg col-8">
              <div className="dataset-validation">
                <ValidationBlock
                  datasetId={dataset.id}
                  version={dataset.draft.head}
                  issuesStatus={dataset.draft.issuesStatus}
                  validation={dataset.draft.validation}
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
              <DatasetPageTabContainer>
                <TabRoutesDraft dataset={dataset} hasEdit={hasEdit} />
              </DatasetPageTabContainer>
            </div>
            <div className="col sidebar">
              <MetaDataBlock
                heading="OpenNeuro Accession Number"
                item={datasetId}
              />
              <EditDescriptionList
                className="dmb-inline-list"
                datasetId={datasetId}
                field="Authors"
                heading="Authors"
                description={description.Authors}
                editMode={hasEdit}
              >
                {description?.Authors?.length ? description.Authors : ["N/A"]}
              </EditDescriptionList>
              {summary && (
                <ModalitiesMetaDataBlock
                  items={summary.modalities}
                  className="dmb-modalities"
                />
              )}
              <MetaDataBlock
                heading={dataset.snapshots.length ? "Versions" : "Version"}
                item={
                  <div className="version-block">
                    <VersionList
                      datasetId={datasetId}
                      hasEdit={hasEdit}
                      items={dataset.snapshots}
                      className="version-dropdown"
                      activeDataset={activeDataset}
                      dateModified={dataset.draft.modified}
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
              <MetaDataBlock
                heading="Uploaded by"
                item={
                  <>
                    <Username user={dataset.uploader} /> on{" "}
                    <DateDistance date={dataset.created} />
                  </>
                }
              />
              {dataset.snapshots?.length
                ? (
                  <MetaDataBlock
                    heading="Last Updated"
                    item={
                      <>
                        <DateDistance date={dataset.draft.modified} />
                      </>
                    }
                  />
                )
                : null}
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
                    editMode={hasEdit}
                  >
                    <Markdown>{description.Acknowledgements || "N/A"}</Markdown>
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
                    editMode={hasEdit}
                  >
                    <Markdown>{description.HowToAcknowledge || "N/A"}</Markdown>
                  </EditDescriptionField>
                )}
              />
              <EditDescriptionList
                className="dmb-list"
                datasetId={datasetId}
                field="Funding"
                heading="Funding"
                description={description.Funding}
                editMode={hasEdit}
              >
                {description.Funding?.length ? description.Funding : ["N/A"]}
              </EditDescriptionList>
              <EditDescriptionList
                className="dmb-list"
                datasetId={datasetId}
                field="ReferencesAndLinks"
                heading="References and Links"
                description={description.ReferencesAndLinks}
                editMode={hasEdit}
              >
                {description.ReferencesAndLinks?.length
                  ? description.ReferencesAndLinks
                  : ["N/A"]}
              </EditDescriptionList>
              <EditDescriptionList
                className="dmb-list"
                datasetId={datasetId}
                field="EthicsApprovals"
                heading="Ethics Approvals"
                description={description.EthicsApprovals}
                editMode={hasEdit}
              >
                {description.EthicsApprovals?.length
                  ? description.EthicsApprovals
                  : ["N/A"]}
              </EditDescriptionList>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DraftContainer
