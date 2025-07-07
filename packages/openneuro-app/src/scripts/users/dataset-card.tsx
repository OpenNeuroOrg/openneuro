import React from "react"
import { formatDistanceToNow, parseISO } from "date-fns"
import getYear from "date-fns/getYear"
import activityPulseIcon from "../../assets/activity-icon.png"
import { Tooltip } from "../components/tooltip/Tooltip"
import { Icon } from "../components/icon/Icon"
import styles from "./scss/datasetcard.module.scss"
import type { DatasetCardProps } from "../types/user-types"
import { ModalityHexagon } from "../components/modality-cube/ModalityHexagon"

export const DatasetCard: React.FC<DatasetCardProps> = (
  { dataset, hasEdit },
) => {
  // Check visibility conditions
  if (!dataset.public && !hasEdit) {
    return null
  }

  const dateAdded = new Date(dataset.created).toLocaleDateString()

  // Check if the created date is valid before formatting
  const parsedCreatedDate = parseISO(dataset.created)
  const dateAddedDifference = isNaN(parsedCreatedDate.getTime())
    ? "Invalid date"
    : formatDistanceToNow(parsedCreatedDate)

  // Check if dataset.analytics exists before accessing its properties
  const downloads = dataset.analytics?.downloads
    ? `${dataset.analytics.downloads.toLocaleString()} Downloads \n`
    : ""
  const views = dataset.analytics?.views
    ? `${dataset.analytics.views.toLocaleString()} Views \n`
    : ""

  // Check if dataset.followers is an array and has length
  const following = Array.isArray(dataset.followers) && dataset.followers.length
    ? `${dataset.followers.length.toLocaleString()} Follower \n`
    : ""

  // Check if dataset.stars is an array and has length
  const stars = Array.isArray(dataset.stars) && dataset.stars.length
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

  const sizeInBytes = dataset.latestSnapshot?.size
  let datasetSize = "Unknown size"

  if (sizeInBytes) {
    if (sizeInBytes >= 1024 ** 3) {
      datasetSize = `${(sizeInBytes / (1024 ** 3)).toFixed(2)} GB`
    } else if (sizeInBytes >= 1024 ** 2) {
      datasetSize = `${(sizeInBytes / (1024 ** 2)).toFixed(2)} MB`
    } else if (sizeInBytes >= 1024) {
      datasetSize = `${(sizeInBytes / 1024).toFixed(2)} KB`
    } else {
      datasetSize = `${sizeInBytes} bytes`
    }
  }

  console.log(dataset)
  const year = getYear(parseISO(dataset.created))
  const authors = dataset.latestSnapshot.description?.Authors
    ? dataset.latestSnapshot.description.Authors.join(" and ")
    : "NO AUTHORS FOUND"
  const datasetCite =
    `${authors} (${year}). ${dataset.latestSnapshot.description.Name}. OpenNeuro. [Dataset] doi: ${dataset.latestSnapshot.description.DatasetDOI}`

  return (
    <div
      className={styles.userDsCard}
      key={dataset.id}
      data-testid={`user-ds-${dataset.id}`}
    >
      <h4>
        <a href={`/datasets/${dataset.id}`}>
          {dataset.name ? dataset.name : dataset.id}
        </a>
      </h4>
      <div className={styles.userDsBody}>
        <cite>{datasetCite}</cite>
      </div>
      <div className={styles.userDsFooter}>
        <div className={styles.userMetawrap}>
          <span>
            Added: <b>{dateAdded}</b> ({dateAddedDifference} ago)
          </span>
          <span>
            OpenNeuro Accession Number: <b>{dataset.id}</b>
          </span>
          <span>
            Dataset Size: <b>{datasetSize}</b>
          </span>
        </div>
        <div className={styles.userIconwrap}>
          {activityIcon}
          {publicIcon && <div className="owner-icon-wrap">{publicIcon}</div>}
          <ModalityHexagon
            size={"small"}
            primaryModality={dataset.latestSnapshot.summary?.primaryModality}
          />
        </div>
      </div>
    </div>
  )
}

export default DatasetCard
