import React from "react"
import bytes from "bytes"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Link } from "react-router-dom"
import { Tooltip } from "../../components/tooltip/Tooltip"
import { Icon } from "../../components/icon/Icon"
import { useCookies } from "react-cookie"
import { getProfile } from "../../authentication/profile"
import { useUser } from "../../queries/user"
import "./search-result.scss"
import activityPulseIcon from "../../../assets/activity-icon.png"
import { ModalityLabel } from "../../components/formatting/modality-label"
import { hasEditPermissions } from "../../authentication/profile"
/**
 * Return an equivalent to moment(date).format('L') without moment
 * @param {*} dateObject
 */
export const formatDate = (dateObject) =>
  new Date(dateObject).toISOString().split("T")[0]

export interface SearchResultItemProps {
  node: {
    id: string
    created: string
    uploader: {
      id: string
      name: string
    }
    public: boolean
    permissions: {
      id: string
      userPermissions: [
        {
          userId: string
          level: string
          access: string
          user: {
            id: string
            name: string
            email: string
            provider: string
          }
        },
      ]
    }
    metadata: {
      ages: number[]
    }
    latestSnapshot: {
      id: string
      size: number
      summary: {
        pet: {
          BodyPart: string
          ScannerManufacturer: string
          ScannerManufacturersModelName: string
          TracerName: string[]
          TracerRadionuclide: string
        }
        modalities: string[]
        sessions: []
        subjects: string[]
        subjectMetadata: [
          {
            participantId: string
            age: [{ age?: number }]
            sex: string
            group: null
          },
        ]
        tasks: string[]
        size: number
        totalFiles: number
        dataProcessed: boolean
      }
      issues: [
        {
          severity: string
        },
      ]
      validation: {
        errors: number
        warnings: number
      }
      description: {
        Name: string
      }
    }
    analytics: {
      views: number
      downloads: number
    }
    stars: [
      {
        userId: string
        datasetId: string
      },
    ]
    followers: [
      {
        userId: string
        datasetId: string
      },
    ]
    snapshots: [
      {
        id: string
        created: string
        tag: string
      },
    ]
  }
  datasetTypeSelected?: string
}

export const SearchResultItem = ({
  node,
  datasetTypeSelected,
}: SearchResultItemProps) => {
  const { user } = useUser()
  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  const profileSub = profile?.sub

  const isAdmin = user?.admin
  const hasEdit = hasEditPermissions(node.permissions, profileSub) || isAdmin

  const heading = node.latestSnapshot.description?.Name
  const summary = node.latestSnapshot?.summary
  const datasetId = node.id
  const numSessions = summary?.sessions.length > 0 ? summary.sessions.length : 1
  const numSubjects = summary?.subjects.length > 0 ? summary.subjects.length : 1
  const accessionNumber = (
    <span className="result-summary-meta">
      <strong>Openneuro Accession Number:</strong>
      <span>{node.id}</span>
    </span>
  )
  const sessions = (
    <span className="result-summary-meta">
      <strong>Sessions:</strong>
      <span>{numSessions.toLocaleString()}</span>
    </span>
  )

  const ages = (value) => {
    if (value) {
      const ages = value.filter((x) => x)
      if (ages.length === 0) return "N/A"
      else if (ages.length === 1) return ages[0]
      else return `${Math.min(...ages)} - ${Math.max(...ages)}`
    } else return "N/A"
  }

  const agesRange = (
    <span className="result-summary-meta">
      <strong>
        {node?.metadata?.ages?.length === 1
          ? "Participant's Age"
          : "Participants' Ages"}
        :{" "}
      </strong>
      <span>
        {ages(summary?.subjectMetadata?.map((subject) => subject.age))}
      </span>
    </span>
  )
  const subjects = (
    <span className="result-summary-meta">
      <strong>Participants:</strong>
      <span>{numSubjects.toLocaleString()}</span>
    </span>
  )
  const size = (
    <span className="result-summary-meta">
      <strong>Size:</strong>
      <span>{bytes(node?.latestSnapshot?.size) || "unknown"}</span>
    </span>
  )
  const files = (
    <span className="result-summary-meta">
      <strong>Files:</strong>
      <span>{summary?.totalFiles.toLocaleString()}</span>
    </span>
  )

  const dateAdded = formatDate(node.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(node.created))
  let lastUpdatedDate
  if (node.snapshots.length) {
    const dateUpdated = formatDate(
      node.snapshots[node.snapshots.length - 1].created,
    )
    const dateUpdatedDifference = formatDistanceToNow(
      parseISO(node.snapshots[node.snapshots.length - 1].created),
    )

    lastUpdatedDate = (
      <>
        <span className="updated-divider">|</span>
        <div className="updated-date">
          <span>Updated:</span>
          {dateUpdated} - {dateUpdatedDifference} ago
        </div>
      </>
    )
  }

  const uploader = (
    <div className="uploader">
      <span>Uploaded by:</span>
      {node.uploader?.name} on {dateAdded} - {dateAddedDifference} ago
    </div>
  )
  const downloads = node.analytics.downloads
    ? node.analytics.downloads.toLocaleString() + " Downloads \n"
    : ""
  const views = node.analytics.views
    ? node.analytics.views.toLocaleString() + " Views \n"
    : ""
  const following = node.followers.length
    ? node.followers.length.toLocaleString() + " Follower \n"
    : ""
  const stars = node.stars.length
    ? node.stars.length.toLocaleString() + " Bookmarked"
    : ""

  const activtyTooltip = downloads + views + following + stars

  const activityIcon = (
    <Tooltip
      tooltip={activtyTooltip}
      flow="up"
      className="result-icon result-activity-icon"
    >
      <Icon
        imgSrc={activityPulseIcon}
        iconSize="22px"
        label="activity"
        iconOnly={true}
      />
    </Tooltip>
  )

  const sharedWithIcon = (
    <Tooltip
      tooltip="Shared with me"
      flow="up"
      className="result-icon result-shared-icon"
    >
      <Icon
        icon="fas fa-user"
        color="rgb(119,191,217)"
        iconSize="16px"
        label="Shared With"
        iconOnly={true}
      />
    </Tooltip>
  )
  const publicIcon = (
    <Tooltip
      tooltip="Visible to all viewers"
      flow="up"
      className="result-icon result-publlic-icon"
    >
      <Icon
        icon="fas fa-globe"
        color="rgb(116,181,105)"
        iconSize="16px"
        label="Public"
        iconOnly={true}
      />
    </Tooltip>
  )

  const errorsIcon = hasEdit && (
    <Tooltip
      tooltip="Invalid"
      flow="up"
      className="result-icon result-errors-icon"
    >
      <Icon
        icon="fas fa-exclamation-circle"
        color="rgb(202,97,86)"
        iconSize="16px"
        label="Invalid"
        iconOnly={true}
      />
    </Tooltip>
  )

  const _list = (type, items) => {
    if (items && items.length > 0) {
      return (
        <>
          <strong>{type}:</strong>
          <div>
            {items.map((item, index) => (
              <span className="list-item" key={index}>
                {item}
              </span>
            ))}
          </div>
        </>
      )
    } else {
      return null
    }
  }

  let invalid = false
  // Legacy issues still flagged
  if (node.latestSnapshot.issues) {
    invalid = node.latestSnapshot.issues.some((issue) =>
      issue.severity === "error"
    )
  } else {
    // Test if there's any schema validator errors
    invalid = node.latestSnapshot.validation?.errors > 0
  }
  const shared = !node.public && node.uploader?.id !== profileSub

  const MyDatasetsPage = datasetTypeSelected === "My Datasets"
  const datasetPerms = node.permissions.userPermissions.map((item) => {
    if (item.user.id === profileSub && item.access !== null) {
      if (item.access === "ro") {
        return "Read Only"
      } else if (item.access === "rw") {
        return "Edit"
      } else {
        return "Admin"
      }
    } else {
      return null
    }
  })

  const datasetOwenerIcons = (
    <div className="owner-icon-wrap">
      {node.public ? publicIcon : null}
      {shared ? sharedWithIcon : null}
      {invalid ? errorsIcon : null}
    </div>
  )

  const modalityList = summary?.modalities.length
    ? (
      <div className="modality-list">
        {_list(
          <>{summary?.modalities.length === 1 ? "Modality" : "Modalities"}</>,
          summary?.modalities.map((modality) => (
            <ModalityLabel key={modality} modality={modality} />
          )),
        )}
      </div>
    )
    : null
  const taskList = summary?.tasks.length
    ? <div className="task-list">{_list(<>Tasks</>, summary?.tasks)}</div>
    : null

  const tracers = summary?.pet?.TracerName?.length
    ? (
      <div className="tracers-list">
        {_list(
          <>
            {summary?.pet?.TracerName.length === 1
              ? "Radiotracer"
              : "Radiotracers"}
          </>,
          summary?.pet?.TracerName,
        )}
      </div>
    )
    : null

  return (
    <>
      <div className="grid grid-nogutter search-result">
        <div className="col col-9">
          <h3>
            <Link to={"/datasets/" + datasetId}>{heading}</Link>
          </h3>
          <div className="result-upload-info">
            {uploader}
            {lastUpdatedDate}
          </div>
        </div>

        <div className="col col-3 col-sm">
          {MyDatasetsPage && (
            <div className="dataset-permissions-tag">
              <small>Access: {datasetPerms}</small>
            </div>
          )}
          <div className="result-icon-wrap">
            {datasetOwenerIcons}
            {activityIcon}
          </div>
        </div>
        <div className="col col-12 result-meta-body">
          {modalityList}
          {taskList}
          {tracers}
        </div>
        <div className="result-meta-footer">
          {accessionNumber}
          {sessions}
          {subjects}
          {agesRange}
          {size}
          {files}
        </div>
      </div>
    </>
  )
}
