import { redis } from "../../libs/redis.js"

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
      const stream = redis.scanStream({
        // Scan for any keys that include the datasetId
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
