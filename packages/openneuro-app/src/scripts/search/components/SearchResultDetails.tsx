import React, { useEffect, useRef } from "react"
import type { FC, ReactNode } from "react"
import bytes from "bytes"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Link } from "react-router-dom"
import type { SearchResultItemProps } from "./SearchResultItem"
import { ModalityLabel } from "../../components/formatting/modality-label"
import { MetaListItemList } from "./MetaListItemList"
import { CreatorListDisplay } from "../../users/creators-list"
import "../scss/search-result-details.scss"

interface SearchResultDetailsProps {
  itemData: SearchResultItemProps["node"] | null
  onClose: () => void
}

export const SearchResultDetails: FC<SearchResultDetailsProps> = (
  { itemData, onClose },
) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (itemData && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [itemData])

  if (!itemData) {
    return null
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const summary = itemData.latestSnapshot?.summary
  const numSessions = summary?.sessions?.length > 0
    ? summary.sessions.length
    : 1
  const numSubjects = summary?.subjects?.length > 0
    ? summary.subjects.length
    : 1

  // Header for more details
  const moreDetailsHeader = (
    <h4>
      <Link to={"/datasets/" + itemData?.id}>
        {itemData.latestSnapshot?.description?.Name || itemData.id}
      </Link>
    </h4>
  )

  // Lists
  const modalityList = summary?.modalities?.length
    ? (
      <div className="modality-list">
        <MetaListItemList
          typeLabel={
            <>{summary?.modalities.length === 1 ? "Modality" : "Modalities"}</>
          }
          items={summary?.modalities.map((modality) => (
            <ModalityLabel key={modality} modality={modality} />
          ))}
        />
      </div>
    )
    : null

  const taskList = summary?.tasks?.length
    ? (
      <div className="task-list">
        <MetaListItemList typeLabel={<>Tasks</>} items={summary?.tasks} />
      </div>
    )
    : null

  const tracers = summary?.pet?.TracerName?.length
    ? (
      <div className="tracers-list">
        <MetaListItemList
          typeLabel={
            <>
              {summary?.pet?.TracerName.length === 1
                ? "Radiotracer"
                : "Radiotracers"}
            </>
          }
          items={summary?.pet?.TracerName}
        />
      </div>
    )
    : null

  // function for consistent meta item rendering
  const renderMetaItem = (
    label: string | ReactNode,
    content: ReactNode,
  ): JSX.Element => (
    <div className="result-summary-meta">
      <label>{label}:&nbsp;</label>
      {content}
    </div>
  )

  const sessions = renderMetaItem("Sessions", numSessions.toLocaleString())
  const subjects = renderMetaItem("Participants", numSubjects.toLocaleString())
  const size = renderMetaItem(
    "Size",
    bytes(itemData?.latestSnapshot?.size) || "unknown",
  )
  const files = renderMetaItem("Files", summary?.totalFiles?.toLocaleString())
  const lastUpdatedDisplay = renderMetaItem(
    "Last Updated",
    <div>
      {formatDate(
        itemData.snapshots?.[itemData.snapshots.length - 1]?.created ||
          itemData.created,
      )}
    </div>,
  )
  const accessionNumberDisplay = renderMetaItem(
    "Openneuro Accession Number",
    <Link to={"/datasets/" + itemData?.id}>
      {itemData?.id}
    </Link>,
  )
  const authors = renderMetaItem(
    "Authors",
    <CreatorListDisplay
      creators={itemData.latestSnapshot?.creators}
      separator=", "
    />,
  )
  const uploaderDisplay = renderMetaItem(
    "Uploader by",
    <div>
      {itemData.uploader?.name} on {formatDate(itemData?.created)} -{" "}
      {formatDistanceToNow(parseISO(itemData?.created))} ago
    </div>,
  )

  return (
    <div className="search-details">
      <div className="search-details-scroll">
        <button
          className="close-details-button"
          onClick={onClose}
          aria-label="Close details"
          ref={closeButtonRef}
        >
          &times;
        </button>
        {moreDetailsHeader}
        {authors}
        {modalityList}
        {taskList}
        {accessionNumberDisplay}
        {tracers}
        {sessions}
        {subjects}
        {size}
        {files}
        {uploaderDisplay}
        {lastUpdatedDisplay}
      </div>
    </div>
  )
}
