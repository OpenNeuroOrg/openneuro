import { redis } from "../libs/redis"
import { getDatasetWorker } from "../libs/datalad-service"
import { getPresignedUrl, publicS3Url } from "../libs/presign"
import Dataset from "../models/dataset"
import {
  addDatasetTree,
  addDatasetTrees,
  getCommitTrees,
  getTree,
  getTreesBulk,
  setCommitTrees,
  setTree,
  type TreeEntry,
} from "../cache/tree"
import { join } from "node:path"

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
export type DatasetFile = {
  id: string
  key: string
  filename: string
  directory: boolean
  size: number
  urls: string[]
}

/**
 * Sum all file sizes for total dataset size
 */
export const computeTotalSize = (files: DatasetFile[]): number =>
  files.reduce((size, f) => size + f.size, 0)

/**
 * Parse an S3 URL from the worker into key and versionId components.
 * URLs: https://s3.amazonaws.com/{bucket}/{key}?versionId={ver}
 */
function parseS3Url(
  url: string,
): { bucket: string; s3Key: string; versionId: string } | null {
  try {
    const parsed = new URL(url)
    const versionId = parsed.searchParams.get("versionId") || ""
    // Path is /{bucket}/{key...} - strip the leading slash and bucket
    const pathParts = parsed.pathname.split("/")
    pathParts.shift() // empty string before leading /
    const bucket = pathParts.shift() || "" // bucket name
    const s3Key = decodeURIComponent(pathParts.join("/"))
    return { bucket, s3Key, versionId }
  } catch {
    return null
  }
}

/**
 * Check if a dataset requires presigned URLs
 *
 * TODO - extend this for granular control for DUA datasets
 */
async function datasetNeedsPresign(datasetId: string): Promise<boolean> {
  const ds = await Dataset.findOne({ id: datasetId }, { public: 1 }).lean()
  return !ds?.public
}

/** Convert a worker response file to a compact TreeEntry */
function workerFileToEntry(
  file: DatasetFile,
  needsPresign: boolean,
): TreeEntry {
  if (file.directory) {
    return {
      n: file.filename,
      h: file.key,
      s: 0,
      k: "",
      v: "",
      b: "",
      p: false,
      d: true,
    }
  }
  const parsed = file.urls[0] ? parseS3Url(file.urls[0]) : null
  // Store empty string for the default bucket to save cache space
  const defaultBucket = process.env.AWS_S3_PUBLIC_BUCKET || ""
  const bucket = parsed?.bucket === defaultBucket ? "" : (parsed?.bucket || "")
  return {
    n: file.filename,
    h: file.id,
    s: file.size,
    k: parsed?.s3Key || "",
    v: parsed?.versionId || "",
    b: bucket,
    p: needsPresign,
    d: false,
  }
}

/** Convert a TreeEntry back to a DatasetFile, resolving presigned URLs if needed */
async function entryToDatasetFile(entry: TreeEntry): Promise<DatasetFile> {
  if (entry.d) {
    return {
      id: entry.h,
      key: entry.h,
      filename: entry.n,
      directory: true,
      size: 0,
      urls: [],
    }
  }
  let url: string
  if (entry.p && entry.k && entry.v) {
    url = await getPresignedUrl(redis, entry.b, entry.k, entry.v)
  } else if (entry.k && entry.v) {
    url = publicS3Url(entry.b, entry.k, entry.v)
  } else {
    url = ""
  }
  return {
    id: entry.h,
    key: entry.h,
    filename: entry.n,
    directory: false,
    size: entry.s,
    urls: [url],
  }
}

/** Convert an array of TreeEntry to DatasetFile[], resolving URLs */
async function entriesToDatasetFiles(
  entries: TreeEntry[],
): Promise<DatasetFile[]> {
  return Promise.all(entries.map(entryToDatasetFile))
}

/**
 * Get files for a specific revision (tree hash or commit hash).
 * Uses content-addressed caching keyed by full git hash.
 */
export const getFiles = async (
  datasetId: string,
  treeish: string,
): Promise<DatasetFile[]> => {
  // Try cache first
  const cached = await getTree(redis, treeish)
  if (cached) {
    return entriesToDatasetFiles(cached)
  }

  // Cache miss: fetch from worker
  const response = await fetch(
    `http://${
      getDatasetWorker(datasetId)
    }/datasets/${datasetId}/tree/${treeish}`,
    { signal: AbortSignal.timeout(10000) },
  )
  const body = await response.json()
  const files: DatasetFile[] | undefined = body?.files

  if (files && files.length > 0) {
    const needsPresign = await datasetNeedsPresign(datasetId)
    const entries = files.map((f) => workerFileToEntry(f, needsPresign))
    // Check if all non-directory files have S3 URLs
    const allExported = files.every(
      (f) => f.directory || f.urls[0]?.includes("s3.amazonaws.com"),
    )
    if (allExported) {
      // Exported trees are content-addressed and stable, cache permanently
      void setTree(redis, treeish, entries)
      void addDatasetTree(redis, datasetId, treeish)
    } else {
      // Still exporting — cache briefly to avoid repeated worker fetches
      void setTree(redis, treeish, entries, 600)
    }
    return files
  }
  return []
}

/**
 * Recursively get all files for a commit/tree, with commit-level caching.
 * Returns flattened file listing with full paths.
 */
export async function getFilesRecursive(
  datasetId: string,
  tree: string,
  path = "",
): Promise<DatasetFile[]> {
  // Check for cached commit-to-trees mapping
  const cachedTreeHashes = await getCommitTrees(redis, tree)
  if (cachedTreeHashes) {
    // Bulk-fetch all trees in one pipeline
    const treesMap = await getTreesBulk(redis, cachedTreeHashes)
    // If all trees are in cache, reconstruct the full listing
    if (treesMap.size === cachedTreeHashes.length) {
      return reconstructFromTrees(treesMap, tree, path)
    }
    // Some trees evicted, fall through to recursive walk
  }

  // Walk the tree recursively, collecting tree hashes along the way
  const collectedHashes: string[] = []
  const files = await walkTree(datasetId, tree, path, collectedHashes)

  // Cache the commit-to-trees mapping for next time
  if (collectedHashes.length > 0) {
    void setCommitTrees(redis, tree, collectedHashes)
    void addDatasetTrees(redis, datasetId, collectedHashes)
  }

  return files
}

/** Walk a tree recursively, populating files and collecting tree hashes */
async function walkTree(
  datasetId: string,
  tree: string,
  path: string,
  collectedHashes: string[],
): Promise<DatasetFile[]> {
  collectedHashes.push(tree)
  const fileTree = await getFiles(datasetId, tree)
  // Parallelize sibling directory fetches
  const results = await Promise.all(
    fileTree.map(async (file) => {
      const absPath = path ? join(path, file.filename) : file.filename
      if (file.directory) {
        return walkTree(datasetId, file.key, absPath, collectedHashes)
      } else {
        return [{ ...file, filename: absPath }]
      }
    }),
  )
  return results.flat()
}

/**
 * Reconstruct a full file listing from a map of cached trees.
 * Walks the tree structure using directory entries' child hashes.
 */
async function reconstructFromTrees(
  treesMap: Map<string, TreeEntry[]>,
  rootTree: string,
  path: string,
): Promise<DatasetFile[]> {
  const entries = treesMap.get(rootTree)
  if (!entries) return []
  const results = await Promise.all(
    entries.map(async (entry) => {
      const absPath = path ? join(path, entry.n) : entry.n
      if (entry.d) {
        return reconstructFromTrees(treesMap, entry.h, absPath)
      } else {
        const file = await entryToDatasetFile(entry)
        return [{ ...file, filename: absPath }]
      }
    }),
  )
  return results.flat()
}
