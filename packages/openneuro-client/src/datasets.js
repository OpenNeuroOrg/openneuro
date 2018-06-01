import gql from 'graphql-tag'

export const getDataset = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      _id: id
      label
      created
      public
      uploader {
        id
        firstName
        lastName
        email
      }
      draft {
        id
        modified
        files {
          id
          filename
          size
        }
        summary {
          modalities
          sessions
          subjects
          tasks
          size
          totalFiles
        }
        issues {
          key
          severity
        }
      }
      snapshots {
        id
        _id: id
        tag
        created
        snapshot_version: tag
      }
    }
  }
`

export const getDatasets = gql`
  query {
    datasets {
      id
      _id: id
      created
      label
      uploader {
        id
      }
      public
    }
  }
`

export const createDataset = gql`
  mutation createDataset($label: String!) {
    createDataset(label: $label) {
      id
      label
    }
  }
`

export const deleteDataset = gql`
  mutation deleteDataset($label: String!) {
    deleteDataset(label: $label) {
      id
    }
  }
`

export const deleteSnapshot = gql`
  mutation deleteSnapshot($datasetId: ID!, $tag: String!) {
    deleteSnapshot(datasetId: $datasetId, tag: $tag)
  }
`

export const updatePublic = gql`
  mutation ($id: ID!, $publicFlag: Boolean!) {
    updatePublic(datasetId: $id, publicFlag: $publicFlag)
  }
`
