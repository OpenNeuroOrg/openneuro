import React from "react"
import { formatDistanceToNow, parseISO } from "date-fns"
import activityPulseIcon from "../../../assets/activity-icon.png"
import { Tooltip } from "@openneuro/components/tooltip"
import { Icon } from "@openneuro/components/icon"
import styles from "../scss/datasetcard.module.scss"

interface Dataset {
  id: string
  created: string
  name: string
  public: boolean
  analytics: {
    views: number
    downloads: number
  }
  stars: [{ userId: string; datasetId: string }]
  followers: [{ userId: string; datasetId: string }]
  latestSnapshot?: {
    id: string
    size: number
    issues: [{ severity: string }]
    created?: string
  }
}

interface DatasetCardProps {
  dataset: Dataset
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const dateAdded = new Date(dataset.created).toLocaleDateString()
  const dateAddedDifference = formatDistanceToNow(parseISO(dataset.created))

  const downloads = dataset.analytics.downloads
    ? `${dataset.analytics.downloads.toLocaleString()} Downloads \n`
    : ""
  const views = dataset.analytics.views
    ? `${dataset.analytics.views.toLocaleString()} Views \n`
    : ""
  const following = dataset.followers.length
    ? `${dataset.followers.length.toLocaleString()} Follower \n`
    : ""
  const stars = dataset.stars.length
    ? `${dataset.stars.length.toLocaleString()} Bookmarked`
    : ""

  const activityTooltip = downloads + views + following + stars

  const activityIcon = (
    <Tooltip
      tooltip={activityTooltip}
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

  const publicIcon = dataset.public && (
    <Tooltip
      tooltip="Visible to all viewers"
      flow="up"
      className="result-icon result-public-icon"
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

  return (
    <div
      className={styles.userDsCard}
      key={dataset.id}
      data-testid={`user-ds-${dataset.id}`}
    >
      <h4>
        <a href={`/datasets/${dataset.id}`}>{dataset.name}</a>
      </h4>
      <div className={styles.userDsFooter}>
        <div className={styles.userMetawrap}>
          <span>
            Added: <b>{dateAdded}</b> ({dateAddedDifference} ago)
          </span>
          <span>
            OpenNeuro Accession Number: <b>{dataset.id}</b>
          </span>
        </div>
        <div className={styles.userIconwrap}>
          {activityIcon}
          {publicIcon && <div className="owner-icon-wrap">{publicIcon}</div>}
        </div>
      </div>
    </div>
  )
}

export default DatasetCard
