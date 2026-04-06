import type { Redis } from "ioredis"
import { decode, encode } from "@msgpack/msgpack"

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
}

function treeKey(hash: string): string {
  return `tree:${hash}`
}

function commitTreesKey(commitHash: string): string {
  return `ct:${commitHash}`
}

function datasetTreesKey(datasetId: string): string {
  return `dt:${datasetId}`
}

/** Read and decode a single tree from cache */
export async function getTree(
  redis: Redis,
  treeHash: string,
): Promise<TreeEntry[] | null> {
  const data = await redis.getBuffer(treeKey(treeHash))
  if (data) {
    return decode(data) as TreeEntry[]
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
  const packed = Buffer.from(encode(entries))
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
      trees.set(treeHashes[i], decode(data as Buffer) as TreeEntry[])
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
  const packed = Buffer.from(encode(treeHashes))
  await redis.set(commitTreesKey(commitHash), packed)
}

/** Read the set of tree hashes for a commit */
export async function getCommitTrees(
  redis: Redis,
  commitHash: string,
): Promise<string[] | null> {
  const data = await redis.getBuffer(commitTreesKey(commitHash))
  if (data) {
    return decode(data) as string[]
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
  if (treeHashes.length > 0) {
    await redis.sadd(datasetTreesKey(datasetId), ...treeHashes)
  }
}

/** Get all tree hashes for a dataset (for cache clearing) */
export async function getDatasetTrees(
  redis: Redis,
  datasetId: string,
): Promise<string[]> {
  return redis.smembers(datasetTreesKey(datasetId))
}

/** Delete all cached trees for a dataset and clean up the index */
export async function clearDatasetTrees(
  redis: Redis,
  datasetId: string,
): Promise<void> {
  const treeHashes = await getDatasetTrees(redis, datasetId)
  if (treeHashes.length > 0) {
    const pipeline = redis.pipeline()
    for (const hash of treeHashes) {
      pipeline.del(treeKey(hash))
    }
    pipeline.del(datasetTreesKey(datasetId))
    await pipeline.exec()
  }
}
