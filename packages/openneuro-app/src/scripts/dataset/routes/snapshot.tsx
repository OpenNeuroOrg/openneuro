import React, { useState } from "react"
import semver from "semver"
import type { ReleaseType } from "semver"
import SnapshotDataset from "../mutations/snapshot"
import EditList from "../fragments/edit-list.jsx"
import { Button } from "../../components/button/Button"
import { DatasetPageBorder } from "./styles/dataset-page-border"
import { HeaderRow4 } from "./styles/header-row"
import FileView from "../files/file-view"
import styled from "@emotion/styled"
import { apiPath } from "../files/file"
import { FileCheckList } from "../fragments/file-check-list"
import { FsckDataset } from "../mutations/fsck-dataset"

const FormRow = styled.div`
  margin-top: 0;
  margin-bottom: 1.3em;
`

export const NoErrors = (
  { datasetId, modified, validation, authors, fileCheck, children },
) => {
  const noErrors = validation?.errors === 0
  // zero authors will cause DOI minting to fail
  const hasAuthor = authors?.length > 0
  const fileCheckFinish = fileCheck !== null
  const noBadFiles = fileCheck?.annexFsck?.length === 0
  // Check if modified is 30 minutes old
  const thirtyMinutes = 1800000
  const modifiedTime = new Date(modified).getTime()
  const currentTime = new Date().getTime()
  const thirtyMinutesAgo = currentTime - thirtyMinutes
  const recheckEnabled = modifiedTime < thirtyMinutesAgo
  const timeDiff = modifiedTime + thirtyMinutes - currentTime
  const minutesDiff = Math.round(timeDiff / (1000 * 60))

  if (noBadFiles && noErrors && hasAuthor) {
    return children
  } else {
    const correctErrorsMessage =
      "BIDS validation must be complete and all errors corrected."
    const noAuthorMessage =
      '"Authors" must include at least one entry in dataset_description.json.'
    const fileChecksPendingMessage =
      "File integrity checks are pending and may take a few minutes to complete. Please wait for checks to finish."
    const badFilesMessage =
      "One or more files in the most recent draft are missing or do not match checksums. Please reupload any files listed below."
    const includedMessages = []
    if (!noErrors) includedMessages.push(correctErrorsMessage)
    if (!hasAuthor) includedMessages.push(noAuthorMessage)
    if (!fileCheckFinish) includedMessages.push(fileChecksPendingMessage)
    if (fileCheckFinish && !noBadFiles) includedMessages.push(badFilesMessage)
    return (
      <span className="text-danger">
        <ul>{includedMessages.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
        {includedMessages.length !== 0 && (
          <p>The above issues must be corrected to create a version.</p>
        )}
        {!noBadFiles && (
          <span>
            <FsckDataset datasetId={datasetId} disabled={!recheckEnabled} />
            {!recheckEnabled && (
              <p>A recheck can be requested in {minutesDiff} minutes.</p>
            )}
          </span>
        )}
        {fileCheckFinish && !noBadFiles && (
          <FileCheckList fileCheck={fileCheck} />
        )}
      </span>
    )
  }
}

const SnapshotRoute = ({
  datasetId,
  modified,
  snapshots,
  validation,
  description,
  fileCheck,
}): React.ReactElement => {
  const [changes, setChanges] = useState([])
  const [semanticLevel, setSemanticLevel] = useState("patch")
  const draftLicense = (description && description.License) || "none"
  const requiredLicense = "CC0"
  const updateToCC0 = draftLicense !== requiredLicense

  const latestSnapshot = snapshots.length && snapshots[snapshots.length - 1]
  const newVersion = snapshots.length && semver.valid(latestSnapshot.tag)
    ? semver.inc(latestSnapshot.tag, semanticLevel as ReleaseType)
    : "1.0.0"

  const majorActive = semanticLevel === "major" && "active"
  const minorActive = semanticLevel === "minor" && "active"
  const patchActive = semanticLevel === "patch" && "active"

  return (
    <DatasetPageBorder>
      <div className="dataset-snapshot-form">
        <div className="dataset-form-body">
          <HeaderRow4>New Version</HeaderRow4>
          {updateToCC0 && (
            <p>
              <strong>Notice:</strong> The current license{" "}
              <i>&quot;{draftLicense}&quot;</i>{" "}
              will be updated to &quot;CC0&quot; when the version is created.
              Please see FAQ item &quot;Are there any restrictions on the
              uploaded data?&quot; for details.
            </p>
          )}
          <p>
            Create a new version of this dataset for download and public access.
            DOIs are assigned to versions created. This will begin an export of
            this dataset to GitHub and S3 if it has been made public.
          </p>
          <FormRow className="snapshot-input-group">
            {newVersion}
            <div className="input-group-btn">
              <Button
                secondary={true}
                label="Major"
                size="xsmall"
                className={`btn btn-default ${majorActive}`}
                onClick={() => setSemanticLevel("major")}
              />
              <Button
                secondary={true}
                label="Minor"
                size="xsmall"
                className={`btn btn-default ${minorActive}`}
                onClick={() => setSemanticLevel("minor")}
              />
              <Button
                secondary={true}
                label="Patch"
                size="xsmall"
                className={`btn btn-default ${patchActive}`}
                onClick={() => setSemanticLevel("patch")}
              />
            </div>
          </FormRow>
          {latestSnapshot
            ? (
              <FormRow>
                <HeaderRow4>Current Changelog</HeaderRow4>
                <FileView
                  url={apiPath(datasetId, latestSnapshot.tag, "CHANGES")}
                  path="CHANGES"
                />
              </FormRow>
            )
            : null}
          <HeaderRow4>New Changelog</HeaderRow4>
          <p>Add CHANGES file lines describing the new version.</p>
          <EditList
            placeholder="Enter new changes here..."
            elements={changes}
            setElements={setChanges}
          />
        </div>
        <NoErrors
          datasetId={datasetId}
          modified={modified}
          validation={validation}
          authors={description.Authors}
          fileCheck={fileCheck}
        >
          {changes.length ? null : (
            <small className="text-danger">
              You must add at least one change message to create a new version
            </small>
          )}
          {snapshots.length === 0
            ? (
              <p>
                Once a version has been created and DOI assigned, the dataset
                can no longer be deleted.
              </p>
            )
            : null}
          <div className="dataset-form-controls">
            <SnapshotDataset
              datasetId={datasetId}
              tag={newVersion}
              changes={changes}
              disabled={changes.length < 1}
            />
          </div>
        </NoErrors>
      </div>
    </DatasetPageBorder>
  )
}

export default SnapshotRoute
