import request from 'superagent'
import { redis } from '../libs/redis'
import CacheItem, { CacheType } from '../cache/item'
import { getDatasetWorker } from '../libs/datalad-service'

/**
 * Convert to URL compatible path
 * @param {String} path
 */
export const encodeFilePath = (path: string): string => {
  return path.replace(new RegExp('/', 'g'), ':')
}

/**
 * Convert to from URL compatible path fo filepath
 * @param {String} path
 */
export const decodeFilePath = (path: string): string => {
  return path.replace(new RegExp(':', 'g'), '/')
}

/**
 * If path is provided, this is a subdirectory, otherwise a root level file.
 * @param {String} path
 * @param {String} filename
 */
export const getFileName = (path: string, filename: string): string => {
  const filePath = path ? [path, filename].join('/') : filename
  return filename ? encodeFilePath(filePath) : encodeFilePath(path)
}

/**
 * Generate file URL for DataLad service
 * @param {string} datasetId
 * @param {string} path - Relative path for the file
 * @param {string} filename
 * @param {string} [revision] - Git hash of commit or tree owning this file
 */
export const fileUrl = (
  datasetId: string,
  path: string,
  filename: string,
  revision?: string,
): string => {
  const fileName = getFileName(path, filename)
  if (revision) {
    return `http://${getDatasetWorker(
      datasetId,
    )}/datasets/${datasetId}/snapshots/${revision}/files/${fileName}`
  } else {
    return `http://${getDatasetWorker(
      datasetId,
    )}/datasets/${datasetId}/files/${fileName}`
  }
}

/**
 * Generate path URL (such a directory or virtual path) for DataLad service
 * @param {String} datasetId
 */
export const filesUrl = (datasetId: string): string =>
  `http://${getDatasetWorker(datasetId)}/datasets/${datasetId}/files`

/** Minimal variant of DatasetFile type from GraphQL API */
type DatasetFile = {
  id: string
  filename: string
  directory: boolean
  size: number
}

/**
 * Sum all file sizes for total dataset size
 */
export const computeTotalSize = (files: [DatasetFile]): number =>
  files.reduce((size, f) => size + f.size, 0)

/**
 * Get files for a specific revision
 * Similar to getDraftFiles but different cache key and fixed revisions
 * @param {string} datasetId - Dataset accession number
 * @param {string} treeish - Git treeish hexsha
 */
export const getFiles = (datasetId, treeish): Promise<[DatasetFile]> => {
  const cache = new CacheItem(redis, CacheType.commitFiles, [
    datasetId,
    treeish.substring(0, 7),
  ])
  return cache.get(
    () =>
      request
        .get(
          `${getDatasetWorker(
            datasetId,
          )}/datasets/${datasetId}/tree/${treeish}`,
        )
        .set('Accept', 'application/json')
        .then(response => {
          if (response.status === 200) {
            const {
              body: { files },
            } = response
            return files as [DatasetFile]
          }
        }) as Promise<[DatasetFile]>,
  )
}
