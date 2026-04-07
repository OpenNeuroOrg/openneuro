import { redis } from "../libs/redis"
import { getDatasetWorker } from "../libs/datalad-service"
import {
  getPresignedUrl,
  getPresignedUrlsBulk,
  publicS3Url,
} from "../libs/presign"
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
export function parseS3Url(
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
export function workerFileToEntry(
  file: DatasetFile,
  needsPresign: boolean,
): TreeEntry {
  if (file.directory) {
    return {
      n: file.filename,
      h: file.id,
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
export async function entryToDatasetFile(
  entry: TreeEntry,
  datasetId: string,
): Promise<DatasetFile> {
  if (entry.d) {
    return {
      id: entry.h,
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
    const serverUrl = process.env.CRN_SERVER_URL
    const filename = encodeURIComponent(entry.n)
    url =
      `${serverUrl}/crn/datasets/${datasetId}/objects/${entry.h}?filename=${filename}`
  }
  return {
    id: entry.h,
    filename: entry.n,
    directory: false,
    size: entry.s,
    urls: [url],
  }
}

/** Convert an array of TreeEntry to DatasetFile[], resolving URLs */
async function entriesToDatasetFiles(
  entries: TreeEntry[],
  datasetId: string,
): Promise<DatasetFile[]> {
  return Promise.all(
    entries.map((entry) => entryToDatasetFile(entry, datasetId)),
  )
}

/**
 * Fetch multiple trees from the worker in a single batch POST request.
 * Returns a map of tree hash -> DatasetFile[].
 */
async function fetchTreesFromWorker(
  datasetId: string,
  treeHashes: string[],
): Promise<Map<string, DatasetFile[]>> {
  const response = await fetch(
    `http://${getDatasetWorker(datasetId)}/datasets/${datasetId}/tree`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trees: treeHashes }),
      signal: AbortSignal.timeout(30000),
    },
  )
  const body = await response.json()
  const treesData: Record<string, DatasetFile[]> | undefined = body?.trees
  const result = new Map<string, DatasetFile[]>()
  if (treesData) {
    for (const [hash, files] of Object.entries(treesData)) {
      result.set(hash, files || [])
    }
  }
  return result
}

/**
 * Cache a batch of worker results, returning entries for each tree.
 */
async function cacheWorkerTrees(
  datasetId: string,
  workerResults: Map<string, DatasetFile[]>,
): Promise<void> {
  const needsPresign = await datasetNeedsPresign(datasetId)
  for (const [hash, files] of workerResults) {
    if (files.length > 0) {
      const entries = files.map((f) => workerFileToEntry(f, needsPresign))
      const allExported = files.every(
        (f) => f.directory || f.urls[0]?.includes("s3.amazonaws.com"),
      )
      if (allExported) {
        void setTree(redis, hash, entries)
        void addDatasetTree(redis, datasetId, hash)
      } else {
        void setTree(redis, hash, entries, 600)
      }
    }
  }
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
    return entriesToDatasetFiles(cached, datasetId)
  }

  // Cache miss: fetch from worker via batch endpoint
  const workerResults = await fetchTreesFromWorker(datasetId, [treeish])
  await cacheWorkerTrees(datasetId, workerResults)
  const files = workerResults.get(treeish)
  if (files && files.length > 0) {
    const needsPresign = await datasetNeedsPresign(datasetId)
    const entries = files.map((f) => workerFileToEntry(f, needsPresign))
    return entriesToDatasetFiles(entries, datasetId)
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
    if (treesMap.size < cachedTreeHashes.length) {
      // Batch-fetch all missing trees from the worker in one request
      const missingHashes = cachedTreeHashes.filter((h) => !treesMap.has(h))
      const workerResults = await fetchTreesFromWorker(datasetId, missingHashes)
      await cacheWorkerTrees(datasetId, workerResults)
      // Re-read the now-cached entries in bulk
      const refetched = await getTreesBulk(redis, missingHashes)
      for (const [hash, entries] of refetched) {
        treesMap.set(hash, entries)
      }
    }
    return reconstructFromTrees(treesMap, tree, path, datasetId)
  }

  // Breadth-first walk: batch all uncached trees per level into one request
  const treesMap = new Map<string, TreeEntry[]>()
  const collectedHashes = new Set<string>()
  let pendingHashes = [tree]

  while (pendingHashes.length > 0) {
    // Check cache for all pending hashes
    const cached = await getTreesBulk(redis, pendingHashes)
    const uncached = pendingHashes.filter((h) => !cached.has(h))

    // Fetch all uncached trees in one worker request
    if (uncached.length > 0) {
      const workerResults = await fetchTreesFromWorker(datasetId, uncached)
      await cacheWorkerTrees(datasetId, workerResults)
      const fetched = await getTreesBulk(redis, uncached)
      for (const [hash, entries] of fetched) {
        cached.set(hash, entries)
      }
    }

    // Merge into treesMap and collect next level of directory hashes
    const nextLevel: string[] = []
    for (const hash of pendingHashes) {
      collectedHashes.add(hash)
      const entries = cached.get(hash)
      if (entries) {
        treesMap.set(hash, entries)
        for (const entry of entries) {
          if (entry.d && !collectedHashes.has(entry.h)) {
            nextLevel.push(entry.h)
          }
        }
      }
    }
    pendingHashes = nextLevel
  }

  // Cache the commit-to-trees mapping for next time
  if (collectedHashes.size > 0) {
    const hashArray = [...collectedHashes]
    void setCommitTrees(redis, tree, hashArray)
    void addDatasetTrees(redis, datasetId, hashArray)
  }

  return reconstructFromTrees(treesMap, tree, path, datasetId)
}

/**
 * Reconstruct a full file listing from a map of cached trees.
 * Walks the tree structure using directory entries' child hashes.
 */
async function reconstructFromTrees(
  treesMap: Map<string, TreeEntry[]>,
  rootTree: string,
  path: string,
  datasetId: string,
): Promise<DatasetFile[]> {
  const stack: { hash: string; path: string }[] = [{ hash: rootTree, path }]
  const fileEntries: { entry: TreeEntry; absPath: string }[] = []

  // Phase 1: walk tree structure (sync), collect file entries
  while (stack.length > 0) {
    const { hash, path: currentPath } = stack.pop()!
    const entries = treesMap.get(hash)
    if (!entries) continue
    for (const entry of entries) {
      const absPath = currentPath ? join(currentPath, entry.n) : entry.n
      if (entry.d) {
        stack.push({ hash: entry.h, path: absPath })
      } else {
        fileEntries.push({ entry, absPath })
      }
    }
  }

  // Phase 2: build results, collecting presign-needed indices
  const presignIndices: number[] = []
  const serverUrl = process.env.CRN_SERVER_URL

  const results: DatasetFile[] = fileEntries.map(({ entry, absPath }, i) => {
    const file: DatasetFile = {
      id: entry.h,
      filename: absPath,
      directory: false,
      size: entry.s,
      urls: [],
    }
    if (entry.p && entry.k && entry.v) {
      // To be presigned
      presignIndices.push(i)
    } else if (entry.k && entry.v) {
      // Known public S3 URL
      file.urls = [publicS3Url(entry.b, entry.k, entry.v)]
    } else {
      // Fallback URL using object API
      const filename = encodeURIComponent(entry.n)
      file.urls = [
        `${serverUrl}/crn/datasets/${datasetId}/objects/${entry.h}?filename=${filename}`,
      ]
    }
    return file
  })

  // Bulk-resolve presigned URLs in minimal Redis requests
  if (presignIndices.length > 0) {
    const urls = await getPresignedUrlsBulk(
      redis,
      presignIndices.map((i) => ({
        bucket: fileEntries[i].entry.b,
        s3Key: fileEntries[i].entry.k,
        versionId: fileEntries[i].entry.v,
      })),
    )
    for (let j = 0; j < presignIndices.length; j++) {
      results[presignIndices[j]].urls = [urls[j]]
    }
  }

  return results
}
