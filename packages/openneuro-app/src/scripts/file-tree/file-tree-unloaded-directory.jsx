import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import DatasetQueryContext from '../datalad/dataset/dataset-query-context.js'
import Spinner from '../common/partials/spinner.jsx'
import gql from 'graphql-tag'

export const DRAFT_FILES_QUERY = gql`
  query dataset($datasetId: ID!, $filePrefix: String!) {
    dataset(id: $datasetId) {
      draft {
        files(prefix: $filePrefix) {
          id
          filename
          size
          directory
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
        filename
        size
        directory
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
    variables: { datasetId, snapshotTag, filePrefix: directory.filename },
    updateQuery: mergeNewFiles(directory, snapshotTag),
  })

const FileTreeUnloadedDirectory = ({ datasetId, snapshotTag, directory }) => {
  const [loading, setLoading] = useState(false)
  const { fetchMore } = useContext(DatasetQueryContext)
  return (
    <button
      className="btn-file-folder"
      onClick={() => {
        // Show a loading state while we wait on the directory to stream in
        setLoading(true)
        fetchMoreDirectory(fetchMore, datasetId, snapshotTag, directory)
        // No need to clear since this component is unmounted immediately
      }}>
      <i className={`type-icon fa fa-folder${loading ? '-open' : ''}`} />{' '}
      {directory.filename}
      <i className={`accordion-icon fa fa-caret${loading ? '-up' : '-down'}`} />
      {loading && <Spinner active text="Loading..." />}
    </button>
  )
}

FileTreeUnloadedDirectory.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
  directory: PropTypes.object,
}

export default FileTreeUnloadedDirectory
