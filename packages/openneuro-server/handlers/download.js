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

export const datasetDownload = (req, res) => {
  const datasetId = req.params.datasetId
  graphql(schema, DRAFT_FILES, null, null, { datasetId })
    .then(({ data }) => {
      res.send({ files: data.dataset.draft.files, datasetId })
    })
    .catch(err => {
      console.log(err)
      res.status(500)
      res.send(err)
    })
}

export const snapshotDownload = (req, res) => {}
