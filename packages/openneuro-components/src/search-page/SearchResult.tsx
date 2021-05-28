import React from 'react'
import bytes from 'bytes'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Link } from 'react-router-dom'
import { formatDate } from '../../../openneuro-app/src/scripts/utils/date.js'

import { Tooltip } from '../tooltip/Tooltip'
import { Icon } from '../icon/Icon'

import './search-result.scss'

import activityPulseIcon from '../assets/activity-icon.png'

export interface SearchResultProps {
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
    draft: {
      id: string
      summary: {
        modalities: [string]
        sessions: []
        subjects: [string]
        subjectMetadata: [
          {
            participantId: string
            age: number
            sex: string
            group: null
          },
        ]
        tasks: [string]
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

export const SearchResult = ({ node, profile }: SearchResultProps) => {
  console.log(node)

  const heading = node.draft.description.Name
  const summary = node.draft.summary
  const numSessions = summary.sessions.length > 0 ? summary.sessions.length : 1
  const numSubjects = summary.subjects.length > 0 ? summary.subjects.length : 1

  const accessionNumber = (
    <span className="result-summary-meta">
      <strong>Openneuro Acession Number:</strong>
      <span> {node.id}</span>
    </span>
  )
  const sessions = (
    <span className="result-summary-meta">
      <strong>Sessions: </strong>
      <span>{numSessions}</span>
    </span>
  )
  const subjects = (
    <span className="result-summary-meta">
      <strong> Subjects: </strong>
      <span>{numSubjects}</span>
    </span>
  )
  const size = (
    <span className="result-summary-meta">
      <strong>Size: </strong>
      <span>{bytes(summary.size)}</span>
    </span>
  )
  const files = (
    <span className="result-summary-meta">
      <strong>Files: </strong>
      <span>{summary.totalFiles}</span>
    </span>
  )

  const uploader = (
    <div className="uploader">
      <span>Uploaded by: </span>
      {node.uploader.name}
    </div>
  )
  const dateAdded = formatDate(node.created)
  const dateAddedDifference = formatDistanceToNow(parseISO(node.created))
  const dateUpdated = formatDate(
    node.snapshots[node.snapshots.length - 1].created,
  )
  const dateUpdatedDifference = formatDistanceToNow(
    parseISO(node.snapshots[node.snapshots.length - 1].created),
  )

  const lastUpdatedDate = (
    <div>
      {node.snapshots.length ? (
        <>
          <span>Updated: </span>
          {dateUpdated} - {dateUpdatedDifference} ago
        </>
      ) : null}
    </div>
  )
  const addedDate = (
    <div>
      <span>Uploaded: </span>
      {dateAdded} - {dateAddedDifference} ago
    </div>
  )
  const downloads = node.analytics.downloads
    ? node.analytics.downloads + ' Downloads'
    : null
  const views = node.analytics.views ? node.analytics.views + ' Views' : null
  const following = node.followers.length
    ? node.followers.length + ' Follower'
    : null
  const stars = node.stars.length ? node.stars.length + ' Bookmarked' : null

  const activtyTooltip =
    downloads + '\n' + views + '\n' + following + '\n' + stars

  const activityIcon = (
    <Tooltip
      tooltip={activtyTooltip}
      flow="left"
      className="result-icon result-activity-icon">
      <Icon imgSrc={activityPulseIcon} iconSize="22px" />
    </Tooltip>
  )

  const sharedWithIcon = (
    <Tooltip
      tooltip="Shared with me"
      flow="up"
      className="result-icon result-shared-icon">
      <Icon icon="fas fa-user" color="rgb(119,191,217)" iconSize="16px" />
    </Tooltip>
  )
  const publicIcon = (
    <Tooltip
      tooltip="Visable to all viewers"
      flow="up"
      className="result-icon result-publlic-icon">
      <Icon icon="fas fa-globe" color="rgb(116,181,105)" iconSize="16px" />
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
      />
    </Tooltip>
  )

  const _list = (type, items) => {
    function wrapWords(str) {
      return str.replace(/\w+/g, '<span>$&</span>')
    }
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
      {!shared ? sharedWithIcon : null}
      {!invalid ? errorsIcon : null}
    </div>
  )

  const modalityList = summary.modalities ? (
    <div className="modality-list">
      {_list(<>Modalities</>, summary.modalities)}
    </div>
  ) : null

  const taskList = summary.modalities ? (
    <div className="task-list">{_list(<>Tasks</>, summary.tasks)}</div>
  ) : null

  return (
    <>
      <div className="grid grid-nogutter search-result">
        <div className="col col-9">
          <h3>
            <Link to="/">{heading}</Link>
          </h3>
          <div className="result-meta-body">
            {modalityList}
            {taskList}
          </div>
        </div>
        <div className="col col-3">
          <div className="result-icon-wrap">
            {datasetOwenerIcons}
            {activityIcon}
          </div>
          <div className="result-upload-info">
            {uploader}
            {lastUpdatedDate}
            {addedDate}
          </div>
        </div>
        <div className="result-meta-footer">
          {accessionNumber}
          {sessions}
          {subjects}
          {size}
          {files}
        </div>
      </div>
    </>
  )
}
