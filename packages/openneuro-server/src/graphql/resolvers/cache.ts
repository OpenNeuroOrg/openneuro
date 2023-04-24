import { redis } from '../../libs/redis.js'
import CacheItem from '../../cache/item'
import { CacheType } from '../../cache/types'

/**
 * Clear the snapshotDownload cache after exports
 */
export async function cacheClear(
  obj: Record<string, unknown>,
  { datasetId, tag }: { datasetId: string; tag: string },
  { userInfo }: { userInfo: { admin: boolean } },
): Promise<boolean> {
  // Check for admin and validate datasetId argument
  if (userInfo?.admin && datasetId.length == 8 && datasetId.startsWith('ds')) {
    const downloadCache = new CacheItem(redis, CacheType.snapshotDownload, [
      datasetId,
      tag,
    ])
    try {
      await downloadCache.drop()
      return true
    } catch (err) {
      return false
    }
  } else {
    return false
  }
}
