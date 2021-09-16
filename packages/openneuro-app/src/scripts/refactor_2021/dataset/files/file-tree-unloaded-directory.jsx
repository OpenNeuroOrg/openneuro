import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import DatasetQueryContext from '../../../datalad/dataset/dataset-query-context.js'
import FileTreeLoading from './file-tree-loading.jsx'
import { gql } from '@apollo/client'
import { AccordionTab } from '@openneuro/components/accordion'

export const DRAFT_FILES_QUERY = gql`
  query dataset($datasetId: ID!, $filePrefix: String!) {
    dataset(id: $datasetId) {
      draft {
        files(prefix: $filePrefix) {
          id
          key
          filename
          size
          directory
          annexed
        }
      }
    }
  }
`

export const SNAPSHOT_FILES_QUERY = gql`
  query snapshot($datasetId: ID!, $snapshotTag: String!, $filePrefix: String!) {
    snapshot(datasetId: $datasetId, tag: $snapshotTag) {
      files(prefix: $filePrefix) {
        id
        key
        filename
        size
        directory
        annexed
      }
    }
  }
`

export const mergeNewFiles = (directory, snapshotTag) => (
  past,
  { fetchMoreResult },
) => {
  // Deep clone the old dataset object
  const newDatasetObj = JSON.parse(JSON.stringify(past))
  const mergeNewFileFilter = f => f.id !== directory.id
  // Remove ourselves from the array
  if (snapshotTag) {
    newDatasetObj.snapshot.files = newDatasetObj.snapshot.files.filter(
      mergeNewFileFilter,
    )
    newDatasetObj.snapshot.files.push(...fetchMoreResult.snapshot.files)
  } else {
    newDatasetObj.dataset.draft.files = newDatasetObj.dataset.draft.files.filter(
      mergeNewFileFilter,
    )
    newDatasetObj.dataset.draft.files.push(
      ...fetchMoreResult.dataset.draft.files,
    )
  }
  return newDatasetObj
}

export const fetchMoreDirectory = (
  fetchMore,
  datasetId,
  snapshotTag,
  directory,
) =>
  fetchMore({
    query: snapshotTag ? SNAPSHOT_FILES_QUERY : DRAFT_FILES_QUERY,
    variables: { datasetId, snapshotTag, filePrefix: directory.filename + '/' },
    updateQuery: mergeNewFiles(directory, snapshotTag),
  })

const FileTreeUnloadedDirectory = ({ datasetId, snapshotTag, directory }) => {
  const [loading, setLoading] = useState(false)
  const [displayLoading, setDisplayLoading] = useState(false)
  const { fetchMore } = useContext(DatasetQueryContext)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setDisplayLoading(true), 150)
      return () => clearTimeout(timer)
    }
  }, [loading])
  return (
    <AccordionTab 
      className="filetree-item"
      label={directory.filename}
      accordionStyle="file-tree"
      onClick={() => {
        // Show a loading state while we wait on the directory to stream in
        setLoading(true)
        fetchMoreDirectory(fetchMore, datasetId, snapshotTag, directory)
        // No need to clear since this component is unmounted immediately
      }}
    >
      <FileTreeLoading size={directory.size} />
    </AccordionTab>
  )
}

FileTreeUnloadedDirectory.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
  directory: PropTypes.object,
}

export default FileTreeUnloadedDirectory
