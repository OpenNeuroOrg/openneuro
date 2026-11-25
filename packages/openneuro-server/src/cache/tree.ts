import type { Redis } from "ioredis"
import { pack, unpack } from "msgpackr"

/** Compact tree entry stored in Redis */
export interface TreeEntry {
  /** filename */
  n: string
  /** child hash (tree hash for dirs, blob/annex key for files) */
  h: string
  /** size in bytes (0 for directories) */
  s: number
  /** S3 object key without bucket prefix (empty for directories) */
  k: string
  /** S3 versionId (empty for directories) */
  v: string
  /** S3 bucket override (empty string = default AWS_S3_PUBLIC_BUCKET) */
  b: string
  /** needs presigned URL */
  p: boolean
  /** is directory */
  d: boolean
  /** is annexed */
  a: boolean
  /** is a symlink */
  l: boolean
}

export const SCAN_COUNT = 5000
export const UNLINK_CHUNK_SIZE = 1000
const SADD_CHUNK_SIZE = 5000

function treeKey(hash: string): string {
  return `tree:${hash}`
}

function commitTreesKey(commitHash: string): string {
  return `ct:${commitHash}`
}

export function datasetTreesKey(datasetId: string): string {
  return `dt:${datasetId}`
}

/** Read and decode a single tree from cache */
export async function getTree(
  redis: Redis,
  treeHash: string,
): Promise<TreeEntry[] | null> {
  const data = await redis.getBuffer(treeKey(treeHash))
  if (data) {
    return unpack(data) as TreeEntry[]
  }
  return null
}

/** Encode and write a tree to cache. Optional TTL for unexported trees. */
export async function setTree(
  redis: Redis,
  treeHash: string,
  entries: TreeEntry[],
  ttl?: number,
): Promise<void> {
  const packed = pack(entries)
  if (ttl) {
    await redis.setex(treeKey(treeHash), ttl, packed)
  } else {
    await redis.set(treeKey(treeHash), packed)
  }
}

/** Pipeline-fetch multiple trees by hash */
export async function getTreesBulk(
  redis: Redis,
  treeHashes: string[],
): Promise<Map<string, TreeEntry[]>> {
  if (treeHashes.length === 0) return new Map()
  const pipeline = redis.pipeline()
  for (const hash of treeHashes) {
    pipeline.getBuffer(treeKey(hash))
  }
  const results = await pipeline.exec()
  const trees = new Map<string, TreeEntry[]>()
  for (let i = 0; i < treeHashes.length; i++) {
    const [err, data] = results[i]
    if (!err && data) {
      trees.set(treeHashes[i], unpack(data as Buffer) as TreeEntry[])
    }
  }
  return trees
}

/** Store the set of tree hashes belonging to a commit */
export async function setCommitTrees(
  redis: Redis,
  commitHash: string,
  treeHashes: string[],
): Promise<void> {
  const packed = pack(treeHashes)
  await redis.set(commitTreesKey(commitHash), packed)
}

/** Read the set of tree hashes for a commit */
export async function getCommitTrees(
  redis: Redis,
  commitHash: string,
): Promise<string[] | null> {
  const data = await redis.getBuffer(commitTreesKey(commitHash))
  if (data) {
    return unpack(data) as string[]
  }
  return null
}

/** Add a tree hash to the dataset's reverse index */
export async function addDatasetTree(
  redis: Redis,
  datasetId: string,
  treeHash: string,
): Promise<void> {
  await redis.sadd(datasetTreesKey(datasetId), treeHash)
}

/** Add multiple tree hashes to the dataset's reverse index */
export async function addDatasetTrees(
  redis: Redis,
  datasetId: string,
  treeHashes: string[],
): Promise<void> {
  if (treeHashes.length === 0) return
  const key = datasetTreesKey(datasetId)
  if (treeHashes.length <= SADD_CHUNK_SIZE) {
    await redis.sadd(key, ...treeHashes)
  } else {
    const pipeline = redis.pipeline()
    for (let i = 0; i < treeHashes.length; i += SADD_CHUNK_SIZE) {
      pipeline.sadd(key, ...treeHashes.slice(i, i + SADD_CHUNK_SIZE))
    }
    await pipeline.exec()
  }
}

/** Get all tree hashes for a dataset (for cache clearing) */
export async function getDatasetTrees(
  redis: Redis,
  datasetId: string,
): Promise<string[]> {
  return redis.smembers(datasetTreesKey(datasetId))
}

/**
 * Unlink full chunks of keys asynchronously in Redis, returning any remaining keys.
 * When `flushAll` is true, also unlinks any trailing partial chunk.
 */
export async function flushUnlinkBatch(
  redis: Redis,
  keys: string[],
  flushAll = false,
): Promise<string[]> {
  const limit = flushAll
    ? keys.length
    : keys.length - (keys.length % UNLINK_CHUNK_SIZE)
  if (limit === 0) return keys

  if (limit <= UNLINK_CHUNK_SIZE) {
    await redis.unlink(...keys.slice(0, limit))
  } else {
    const pipeline = redis.pipeline()
    for (let i = 0; i < limit; i += UNLINK_CHUNK_SIZE) {
      pipeline.unlink(...keys.slice(i, i + UNLINK_CHUNK_SIZE))
    }
    await pipeline.exec()
  }
  return keys.slice(limit)
}

/** Delete all cached trees for a dataset and clean up the index */
export async function clearDatasetTrees(
  redis: Redis,
  datasetId: string,
): Promise<void> {
  const indexKey = datasetTreesKey(datasetId)
  const stream = redis.sscanStream(indexKey, { count: SCAN_COUNT })
  let batch: string[] = []
  let hasEntries = false

  for await (const hashes of stream) {
    const hashList = hashes as string[]
    if (hashList.length === 0) continue
    hasEntries = true
    for (const hash of hashList) {
      batch.push(treeKey(hash), commitTreesKey(hash))
    }
    batch = await flushUnlinkBatch(redis, batch, false)
  }

  if (hasEntries) {
    batch.push(indexKey)
    await flushUnlinkBatch(redis, batch, true)
  }
}
