import { getRedis } from "../../libs/redis.js"
import {
  clearDatasetTrees,
  datasetTreesKey,
  flushUnlinkBatch,
  SCAN_COUNT,
} from "../../cache/tree"
import type { GraphQLContext } from "../builder"

async function clearDatasetCacheKeys(datasetId: string): Promise<void> {
  const redis = getRedis()
  const treeIndexKey = datasetTreesKey(datasetId)
  const lockPrefix = `openneuro:create-snapshot-lock:${datasetId}:`
  const stream = redis.scanStream({
    match: `*${datasetId}*`,
    count: SCAN_COUNT,
  })
  let batch: string[] = []

  for await (const keys of stream) {
    for (const key of keys as string[]) {
      if (key !== treeIndexKey && !key.startsWith(lockPrefix)) {
        batch.push(key)
      }
    }
    batch = await flushUnlinkBatch(redis, batch, false)
  }

  await flushUnlinkBatch(redis, batch, true)
}

/**
 * Clear all cache entries for a given datasetId
 */
export async function cacheClear(
  obj: unknown,
  { datasetId }: { datasetId: string },
  { userInfo }: GraphQLContext,
): Promise<boolean> {
  // Check for admin and validate datasetId argument
  if (userInfo?.admin && datasetId.length == 8 && datasetId.startsWith("ds")) {
    try {
      await Promise.all([
        clearDatasetTrees(getRedis(), datasetId),
        clearDatasetCacheKeys(datasetId),
      ])
      return true
    } catch (_err) {
      return false
    }
  } else {
    return false
  }
}
