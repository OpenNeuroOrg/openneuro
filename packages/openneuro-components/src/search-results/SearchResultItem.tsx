import React from 'react'

export interface SearchResultItemProps {
  name: string
  modalities: string[]
  tasks: string[]
  accessionNumber: string
  subjects: number
  sessions: number
  files: number
  size: string
  uploader: string
  updated: string
  downloads: number
  views: number
  followers: number
  bookmarks: number
}

export const SearchResultItem = ({
  name,
  modalities,
  tasks,
  accessionNumber,
  subjects,
  sessions,
  files,
  size,
  uploader,
  updated,
  downloads,
  views,
  followers,
  bookmarks,
}: SearchResultItemProps) => {
  return (
    <li>
      <h4>{name}</h4>
      <div>MODALITIES: {modalities.join(' ')}</div>
      <div>TASKS: {tasks.join(' ')}</div>
      <div>OPENNEURO ACCESSION NUMBER: {accessionNumber}</div>
      <div>SUBJECTS: {subjects}</div>
      <div>SESSIONS: {sessions}</div>
      <div>FILES: {files}</div>
      <div>SIZE: {size}</div>
      <div>Uploaded by: {uploader}</div>
      <div>Updated: {updated}</div>
      <hr />
      <div>{downloads} Downloads</div>
      <div>{views} Views</div>
      <div>{followers} Following</div>
      <div>{bookmarks} Bookmarked</div>
    </li>
  )
}
