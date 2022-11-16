import { _getDatasetFiles } from './datasets'

export function lsSnapshot(client, datasetId, tree) {
  return _getDatasetFiles(
    client,
    datasetId,
    f => {
      process.stdout.write(`${f.filename}\t${f.size}\n`)
    },
    '',
    tree,
  )
}
