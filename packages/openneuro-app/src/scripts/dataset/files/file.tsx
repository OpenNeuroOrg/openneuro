import React from "react"
import bytes from "bytes"
import { Link } from "react-router-dom"
import UpdateFile from "../mutations/update-file.jsx"
import DeleteFile from "../mutations/delete-file.jsx"
import { Media } from "../../styles/media"
import RemoveAnnexObject from "../mutations/remove-annex-object.jsx"
import FlagAnnexObject from "../mutations/flag-annex-object.jsx"
import { isAdmin } from "../../authentication/admin-user.jsx"
import { getProfile, hasEditPermissions } from "../../authentication/profile"
import { Icon } from "../../components/icon/Icon"
import { Tooltip } from "../../components/tooltip/Tooltip"
import { useCookies } from "react-cookie"
import { useAgreement } from "../../components/agreement"

const filePath = (path, filename) => `${(path && path + ":") || ""}${filename}`

const filetypeIcons = {
  md: {
    icon: "fab fa-markdown",
    color: "deepskyblue",
  },
  json: {
    icon: "fab fa-node-js",
    color: "limegreen",
  },
  tsv: {
    icon: "fas fa-file-excel",
    color: "lightgreen",
  },
  csv: {
    icon: "fas fa-file-csv",
    color: "lightgreen",
  },
  nii: {
    icon: "fas fa-brain",
    color: "mediumpurple",
  },
  bval: {
    icon: "fas fa-file-alt",
    color: "cornflowerblue",
  },
  bvec: {
    icon: "fas fa-file-alt",
    color: "cornflowerblue",
  },
}
const specialFileIcons = {
  README: filetypeIcons.md,
  CHANGES: {
    icon: "fas fa-file-alt",
    color: "orange",
  },
  LICENSE: {
    icon: "fas fa-file-alt",
    color: "darkslateblue",
  },
}
const defaultFileIcon = {
  icon: "fas fa-file",
  color: "black",
}

const fileExtPattern = /\.([0-9a-z]+)(\.gz)?$/i

const getFileIcon = (filename) => {
  if (Object.keys(specialFileIcons).includes(filename)) {
    return specialFileIcons[filename]
  }
  const extension = fileExtPattern.exec(filename)?.[1]
  if (Object.keys(filetypeIcons).includes(extension)) {
    return filetypeIcons[extension]
  } else {
    return defaultFileIcon
  }
}

export const apiPath = (datasetId, snapshotTag, filePath) => {
  const snapshotPath = snapshotTag ? `/snapshots/${snapshotTag}` : ""
  return `/crn/datasets/${datasetId}${snapshotPath}/files/${filePath}`
}

interface FileProps {
  id: string
  size: bigint
  datasetId: string
  path: string
  filename: string
  snapshotTag: string
  editMode: boolean
  isMobile: boolean
  annexed: boolean
  annexKey: string
  datasetPermissions: string[]
  urls: string[]
  toggleFileToDelete: ({
    id,
    path,
    filename,
  }: {
    id: string
    path: string
    filename: string
  }) => void
  isFileToBeDeleted: (id: string) => boolean
}

const File = ({
  id,
  size,
  datasetId,
  path,
  filename,
  snapshotTag,
  editMode = false,
  isMobile,
  annexed,
  annexKey,
  datasetPermissions,
  toggleFileToDelete,
  isFileToBeDeleted,
  urls,
}: FileProps): JSX.Element => {
  const { icon, color } = getFileIcon(filename)
  const snapshotVersionPath = snapshotTag ? `/versions/${snapshotTag}` : ""
  // React route to display the file
  const viewerPath =
    `/datasets/${datasetId}${snapshotVersionPath}/file-display/${
      filePath(
        path,
        filename,
      )
    }`
  const [agreed] = useAgreement()
  const [cookies] = useCookies()
  const user = getProfile(cookies)
  const admin = isAdmin()
  return (
    <>
      <Icon icon={`${icon}`} color={color} />
      &nbsp;&nbsp;
      {filename}
      <span className="filetree-editfile">
        {agreed && (
          <Media greaterThanOrEqual="medium">
            <Tooltip
              tooltip={`Download: ${bytes.format(Number(size)) as string}`}
            >
              <span className="edit-file download-file">
                <a
                  href={urls?.[0] ||
                    apiPath(datasetId, snapshotTag, filePath(path, filename))}
                  download={filename}
                  aria-label="download file"
                >
                  <i className="fa fa-download" />
                </a>
              </span>
            </Tooltip>
          </Media>
        )}
        {agreed && (
          <Tooltip tooltip="View">
            <span className="edit-file view-file">
              <Link to={viewerPath} aria-label="view file">
                <i className="fa fa-eye" />
              </Link>
            </span>
          </Tooltip>
        )}
        {editMode && (
          <Media greaterThanOrEqual="medium">
            <Tooltip tooltip="Update">
              <UpdateFile datasetId={datasetId} path={path} filename={filename}>
                <i className="fa fa-cloud-upload" />
              </UpdateFile>
            </Tooltip>
          </Media>
        )}
        {editMode && filename !== "dataset_description.json" && (
          <>
            <Media greaterThanOrEqual="medium">
              <Tooltip tooltip="Delete">
                <DeleteFile
                  datasetId={datasetId}
                  path={path}
                  filename={filename}
                />
              </Tooltip>
            </Media>
            <Media greaterThanOrEqual="medium">
              <Tooltip
                tooltip={isFileToBeDeleted(id)
                  ? "Added to Bulk Delete"
                  : "Add to Bulk Delete"}
              >
                <div
                  className={isFileToBeDeleted(id)
                    ? "added-to-bd bulk-delete-checkbox-group delete-file"
                    : "bulk-delete-checkbox-group delete-file"}
                >
                  <input
                    id={"cb-" + filename}
                    type="checkbox"
                    checked={isFileToBeDeleted(id)}
                    onChange={() => toggleFileToDelete({ id, path, filename })}
                  />
                  <label htmlFor={"cb-" + filename}>
                    <Icon icon="fas fa-dumpster" />
                    {isFileToBeDeleted(id) && (
                      <span className="added-to-bulk">Added</span>
                    )}
                  </label>
                </div>
              </Tooltip>
            </Media>
          </>
        )}

        {!isMobile &&
          annexed &&
          (admin
            ? (
              <Media greaterThanOrEqual="medium">
                <RemoveAnnexObject
                  datasetId={datasetId}
                  snapshot={snapshotTag}
                  annexKey={annexKey}
                  path={path}
                  filename={filename}
                />
              </Media>
            )
            : hasEditPermissions(datasetPermissions, user && user.sub)
            ? (
              <Media greaterThanOrEqual="medium">
                <FlagAnnexObject
                  datasetId={datasetId}
                  snapshot={snapshotTag}
                  filepath={filePath(path, filename)}
                  annexKey={annexKey}
                />
              </Media>
            )
            : null)}
      </span>
    </>
  )
}

export default File
