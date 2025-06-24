import React from "react"
import getYear from "date-fns/getYear"
import parseISO from "date-fns/parseISO"
import { Link } from "react-router-dom"
import { Tooltip } from "../../components/tooltip/Tooltip"
import { Icon } from "../../components/icon/Icon"
import { useCookies } from "react-cookie"
import { getProfile } from "../../authentication/profile"
import { useUser } from "../../queries/user"
import "../scss/search-result.scss"
import activityPulseIcon from "../../../assets/activity-icon.png"
import { hasEditPermissions } from "../../authentication/profile"
import { ModalityHexagon } from "../../components/modality-cube/ModalityHexagon"

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
      readme: string
      summary: {
        pet: {
          BodyPart: string
          ScannerManufacturer: string
          ScannerManufacturersModelName: string
          TracerName: string[]
          TracerRadionuclide: string
        }
        primaryModality: string
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
        Authors: string[]
        Name: string
        DatasetDOI: string
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
  onClick: (itemId: string, event: React.MouseEvent<HTMLButtonElement>) => void
  isExpanded: boolean
}

export const SearchResultItem = ({
  node,
  datasetTypeSelected,
  onClick,
  isExpanded,
}: SearchResultItemProps) => {
  const { user } = useUser()
  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  const profileSub = profile?.sub

  const isAdmin = user?.admin
  const hasEdit = hasEditPermissions(node.permissions, profileSub) || isAdmin

  const heading = node.latestSnapshot.description?.Name
    ? node.latestSnapshot.description?.Name
    : node.id

  const datasetId = node.id

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

  let invalid = false
  if (node.latestSnapshot.issues) {
    invalid = node.latestSnapshot.issues.some(
      (issue) => issue.severity === "error",
    )
  } else {
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

  const year = getYear(parseISO(node.created))
  const authors = node.latestSnapshot.description?.Authors
    ? node.latestSnapshot.description.Authors.join(" and ")
    : "NO AUTHORS FOUND"
  const datasetCite =
    `${authors} (${year}). ${node.latestSnapshot.description.Name}. OpenNeuro. [Dataset] doi: ${node.latestSnapshot.description.DatasetDOI}`
  const trimlength = 450

  return (
    <>
      <div
        className={`grid grid-nogutter search-result ${
          isExpanded ? "expanded" : ""
        }`}
      >
        <div className="col col-9">
          <div className="col col-12">
            <h3>
              <Link to={"/datasets/" + datasetId}>{heading}</Link>
            </h3>
            {MyDatasetsPage && (
              <div className="dataset-permissions-tag">
                <small>Access: {datasetPerms}</small>
              </div>
            )}
            <p>
              {node.latestSnapshot?.readme
                ? (node.latestSnapshot.readme.length > trimlength
                  ? `${node.latestSnapshot.readme.substring(0, trimlength)}...`
                  : node.latestSnapshot.readme)
                : ""}
            </p>
            <cite>{datasetCite}</cite>
          </div>
        </div>

        <div className="col col-3 grid">
          <div className="col col-12 result-icon-wrap">
            {datasetOwenerIcons}
            {activityIcon}
            <ModalityHexagon
              primaryModality={node.latestSnapshot.summary?.primaryModality}
            />
          </div>
          <div className="col col-12 result-actions">
            <button
              className={`on-button on-button--small ${
                isExpanded && "expanded"
              }`}
              onClick={(e) => onClick(node.id, e)}
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
