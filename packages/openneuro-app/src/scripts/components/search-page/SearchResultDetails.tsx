import React from "react"
import type { FC } from "react"
import bytes from "bytes"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Link } from "react-router-dom"
import { SearchResultItemProps } from "./SearchResultItem"
import { ModalityLabel } from "../formatting/modality-label"

interface SearchResultDetailsProps {
  itemData: SearchResultItemProps["node"] | null
  onClose: () => void
}

export const SearchResultDetails: FC<SearchResultDetailsProps> = (
  { itemData, onClose },
) => {
  if (!itemData) {
    return null
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const _list = (
    type: JSX.Element,
    items: (string | JSX.Element)[],
  ): JSX.Element | null => {
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

  const summary = itemData.latestSnapshot?.summary
  const numSessions = summary?.sessions?.length > 0
    ? summary.sessions.length
    : 1
  const numSubjects = summary?.subjects?.length > 0
    ? summary.subjects.length
    : 1

  const sessions = (
    <p className="result-summary-meta">
      <strong>Sessions:</strong>
      <span>{numSessions.toLocaleString()}</span>
    </p>
  )

  const subjects = (
    <p className="result-summary-meta">
      <strong>Participants:</strong>
      <span>{numSubjects.toLocaleString()}</span>
    </p>
  )

  const size = (
    <p className="result-summary-meta">
      <strong>Size:</strong>
      <span>{bytes(itemData?.latestSnapshot?.size) || "unknown"}</span>
    </p>
  )

  const files = (
    <p className="result-summary-meta">
      <strong>Files:</strong>
      <span>{summary?.totalFiles?.toLocaleString()}</span>
    </p>
  )

  const moreDetailsHeader = (
    <p className="result-summary-meta">
      <strong>More Details for{" "}</strong>
      <span>{itemData.latestSnapshot?.description?.Name || itemData.id}</span>
    </p>
  )

  const totalFilesDisplay = (
    <p className="result-summary-meta">
      <strong>Total Files:</strong>{" "}
      <span>
        {itemData.latestSnapshot?.summary?.totalFiles?.toLocaleString()}
      </span>
    </p>
  )

  const lastUpdatedDisplay = (
    <p className="result-summary-meta">
      <strong>Last Updated:</strong>{" "}
      <span>
        {formatDate(
          itemData.snapshots?.[itemData.snapshots.length - 1]?.created ||
            itemData.created,
        )}
      </span>
    </p>
  )

  const accessionNumberDisplay = (
    <p className="result-summary-meta">
      <strong>Openneuro Accession Number:</strong>
      <span>
        <Link to={"/datasets/" + itemData?.id}>
          {itemData?.id}
        </Link>
      </span>
    </p>
  )
  const authors = itemData.latestSnapshot.description?.Authors
  const uploaderDisplay = (
    <p className="result-summary-meta">
      <strong>Uploader:</strong>{" "}
      <span>
        {itemData.uploader?.name} on {formatDate(itemData?.created)} -{" "}
        {formatDistanceToNow(parseISO(itemData?.created))} ago
      </span>
    </p>
  )

  const modalityList = summary?.modalities?.length
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

  const taskList = summary?.tasks?.length
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
    <div className="search-details">
      <div className="search-details-scroll">
        <button
          className="close-details-button"
          onClick={onClose}
          aria-label="Close details"
        >
          &times;
        </button>
        {moreDetailsHeader}
        {authors}
        {totalFilesDisplay}
        {lastUpdatedDisplay}
        {modalityList}
        {taskList}
        {tracers}
        {sessions}
        {subjects}
        {size}
        {files}
        {accessionNumberDisplay}
        {uploaderDisplay}
      </div>
    </div>
  )
}
