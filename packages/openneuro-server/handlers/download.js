import { graphql } from 'graphql'
import schema from '../graphql/schema.js'

const DRAFT_FILES = `
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        files {
          id
          filename
          size
          urls
        }
      }
    }
  }
`

const SNAPSHOT_FILES = `
  query snapshot($datasetId: ID!, $tag: String!) {
    snapshot(id: $datasetId) {
      id
      files {
        id
        filename
        size
        urls
      }
    }
  }
`

export const datasetDownload = (req, res) => {
  const datasetId = req.params.datasetId
  graphql(schema, DRAFT_FILES, null, null, { datasetId })
    .then(({ data }) => {
      res.send({ files: data.dataset.draft.files, datasetId })
    })
    .catch(err => {
      res.status(500)
      res.send(err)
    })
}

export const snapshotDownload = (req, res) => {
  const datasetId = req.params.datasetId
  const tag = req.params.snapshotId
  graphql(schema, SNAPSHOT_FILES, null, null, { datasetId, tag })
    .then(({ data }) => {
      res.send({ files: data.snapshot.files, datasetId, tag })
    })
    .catch(err => {
      res.status(500)
      res.send(err)
    })
}
