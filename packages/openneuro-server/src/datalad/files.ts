import { redis } from "../libs/redis"
import CacheItem, { CacheType } from "../cache/item"
import { getDatasetWorker } from "../libs/datalad-service"

/**
 * Convert to URL compatible path
 * @param {String} path
 */
export const encodeFilePath = (path: string): string => {
  return path.replace(new RegExp("/", "g"), ":")
}

/**
 * Convert from URL compatible path to filepath
 * @param {String} path
 */
export const decodeFilePath = (path: string): string => {
  return path.replace(new RegExp(":", "g"), "/")
}

/**
 * If path is provided, this is a subdirectory, otherwise a root level file.
 * @param {String} path
 * @param {String} filename
 */
export const getFileName = (path: string, filename: string): string => {
  const filePath = path ? [path, filename].join("/") : filename
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
    return `http://${
      getDatasetWorker(
        datasetId,
      )
    }/datasets/${datasetId}/snapshots/${revision}/files/${fileName}`
  } else {
    return `http://${
      getDatasetWorker(
        datasetId,
      )
    }/datasets/${datasetId}/files/${fileName}`
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
  urls: string[]
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
export const getFiles = (datasetId, treeish): Promise<[DatasetFile?]> => {
  const cache = new CacheItem(redis, CacheType.commitFiles, [
    datasetId,
    treeish.substring(0, 7),
  ], 432000)
  return cache.get(
    async (doNotCache): Promise<[DatasetFile?]> => {
      const response = await fetch(
        `http://${
          getDatasetWorker(
            datasetId,
          )
        }/datasets/${datasetId}/tree/${treeish}`,
        {
          signal: AbortSignal.timeout(10000),
        },
      )
      const body = await response.json()
      const files = body?.files
      if (files) {
        for (const f of files) {
          // Skip caching this tree if it doesn't contain S3 URLs - likely still exporting
          if (!f.directory && !f.urls[0].includes("s3.amazonaws.com")) {
            doNotCache(true)
            break
          }
        }
        return files
      } else {
        // Possible to have zero files here, return an empty array
        return []
      }
    },
  )
}
