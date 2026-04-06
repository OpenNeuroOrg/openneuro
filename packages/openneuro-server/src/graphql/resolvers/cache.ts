import { redis } from "../../libs/redis.js"
import { clearDatasetTrees } from "../../cache/tree"

/**
 * Clear all cache entries for a given datasetId
 */
export async function cacheClear(
  obj: Record<string, unknown>,
  { datasetId }: { datasetId: string },
  { userInfo }: { userInfo: { admin: boolean } },
): Promise<boolean> {
  // Check for admin and validate datasetId argument
  if (userInfo?.admin && datasetId.length == 8 && datasetId.startsWith("ds")) {
    try {
      // Clear tree cache entries via the dataset-to-trees index
      await clearDatasetTrees(redis, datasetId)

      // Also clear non-tree cache keys (descriptions, snapshots, etc.)
      const stream = redis.scanStream({
        match: `*${datasetId}*`,
      })
      const pipeline = redis.pipeline()
      for await (const keys of stream) {
        for (const key of keys) {
          pipeline.del(key)
        }
      }
      await pipeline.exec()
      return true
    } catch (_err) {
      return false
    }
  } else {
    return false
  }
}
