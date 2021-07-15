import React from 'react'
import bytes from 'bytes'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Link } from 'react-router-dom'

import { Tooltip } from '../tooltip/Tooltip'
import { Icon } from '../icon/Icon'

import './search-result.scss'

import activityPulseIcon from '../assets/activity-icon.png'

/**
 * Return an equivalent to moment(date).format('L') without moment
 * @param {*} dateObject
 */
export const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]

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
      ages: number
    }
    draft: {
      id: string
      summary: {
        modalities: string[]
        sessions: []
        subjects: string[]
        subjectMetadata: [
          {
            participantId: string
            age: number
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
  profile: Record<string, any>
}

export const SearchResultItem = ({ node, profile }: SearchResultItemProps) => {
  const heading = node.draft.description?.Name
  const summary = node.draft.summary
  const datasetId = node.draft.id
  const numSessions = summary?.sessions.length > 0 ? summary.sessions.length : 1
  const numSubjects = summary?.subjects.length > 0 ? summary.subjects.length : 1

  const accessionNumber = (
    <span className="result-summary-meta">
      <strong>Openneuro Accession Number:</strong>
      <span> {node.id}</span>
    </span>
  )
  const sessions = (
    <span className="result-summary-meta">
      <strong>Sessions: </strong>
      <span>{numSessions.toLocaleString()}</span>
    </span>
  )

  const ages = (
    <span className="result-summary-meta">
      <strong>Participants' Ages: </strong>
      <span>
        {node?.metadata?.ages ? node.metadata.ages.toLocaleString() : 'N/A'}
      </span>
    </span>
  )
  const subjects = (
    <span className="result-summary-meta">
      <strong> Participants: </strong>
      <span>{numSubjects.toLocaleString()}</span>
    </span>
  )
  const size = (
    <span className="result-summary-meta">
      <strong>Size: </strong>
      <span>{bytes(summary?.size)}</span>
    </span>
  )
  const files = (
    <span className="result-summary-meta">
      <strong>Files: </strong>
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
      <div className="updated-date">
        <span className="divider">|</span>
        <span>Updated: </span>
        {dateUpdated} - {dateUpdatedDifference} ago
      </div>
    )
  }

  const uploader = (
    <div className="uploader">
      <span>Uploaded by: </span>
      {node.uploader.name} on {dateAdded} - {dateAddedDifference} ago
    </div>
  )
  const downloads = node.analytics.downloads
    ? node.analytics.downloads.toLocaleString() + ' Downloads \n'
    : ''
  const views = node.analytics.views
    ? node.analytics.views.toLocaleString() + ' Views \n'
    : ''
  const following = node.followers.length
    ? node.followers.length.toLocaleString() + ' Follower \n'
    : ''
  const stars = node.stars.length
    ? node.stars.length.toLocaleString() + ' Bookmarked'
    : ''

  const activtyTooltip = downloads + views + following + stars

  const activityIcon = (
    <Tooltip
      tooltip={activtyTooltip}
      flow="up"
      className="result-icon result-activity-icon">
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
      className="result-icon result-shared-icon">
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
      tooltip="Visable to all viewers"
      flow="up"
      className="result-icon result-publlic-icon">
      <Icon
        icon="fas fa-globe"
        color="rgb(116,181,105)"
        iconSize="16px"
        label="Public"
        iconOnly={true}
      />
    </Tooltip>
  )

  const errorsIcon = (
    <Tooltip
      tooltip="Invalid"
      flow="up"
      className="result-icon result-errors-icon">
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
  const invalid =
    !node.draft.issues ||
    node.draft.issues.some(issue => issue.severity === 'error')
  const shared = !node.public && node.uploader.id !== profile.sub

  const datasetOwenerIcons = (
    <div className="owner-icon-wrap">
      {node.public ? publicIcon : null}
      {shared ? sharedWithIcon : null}
      {invalid ? errorsIcon : null}
    </div>
  )

  const modalityList = summary?.modalities.length ? (
    <div className="modality-list">
      {_list(
        <>{summary?.modalities.length === 1 ? 'Modality' : 'Modalities'}</>,
        summary?.modalities,
      )}
    </div>
  ) : null
  const taskList = summary?.tasks.length ? (
    <div className="task-list">{_list(<>Tasks</>, summary?.tasks)}</div>
  ) : null

  return (
    <>
      <div className="grid grid-nogutter search-result">
        <div className="col col-9">
          <h3>
            <Link to={'/datasets/' + datasetId}>{heading}</Link>
          </h3>
          <div className="result-upload-info">
            {uploader}
            {lastUpdatedDate}
          </div>
        </div>
        <div className="col col-3">
          <div className="result-icon-wrap">
            {datasetOwenerIcons}
            {activityIcon}
          </div>
        </div>
        <div className="col col-12 result-meta-body">
          {modalityList}
          {taskList}
        </div>
        <div className="result-meta-footer">
          {accessionNumber}
          {sessions}
          {subjects}
          {ages}
          {size}
          {files}
        </div>
      </div>
    </>
  )
}
