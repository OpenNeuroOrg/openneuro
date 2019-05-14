import config from '../config.js'
import fetch from 'node-fetch'
import { addFileString, commitFiles } from './dataset.js'

export const readmeUrl = (datasetId, revision) => {
  return `http://${
    config.datalad.uri
  }/datasets/${datasetId}/snapshots/${revision}/files/README`
}

export const readme = (obj, { datasetId, revision }) => {
  /** Why are we using fetch here instead of superagent?
   * The backend guesses wrong at the MIME type so fetch lets us get the string
   * without messing around with superagent parsers
   *
   * We may want to use less superagent anyways just to avoid library weight
   */
  return fetch(readmeUrl(datasetId, revision)).then(
    res => (res.status === 200 ? res.text() : null),
  )
}

export const setReadme = (datasetId, readme, user) => {
  return addFileString(datasetId, 'README', 'text/plain', readme).then(() =>
    commitFiles(datasetId, user),
  )
}
