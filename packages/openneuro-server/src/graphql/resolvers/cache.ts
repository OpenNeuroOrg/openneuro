import { redis } from '../../libs/redis.js'

export async function cacheClear(
  obj,
  { datasetId }: { datasetId: string },
  { userInfo },
): Promise<boolean> {
  // Check for admin and validate datasetId argument
  if (userInfo?.admin && datasetId.length == 8 && datasetId.startsWith('ds')) {
    const keys = await redis.keys(`*${datasetId}*`)
    if (keys.length) {
      const transaction = redis.pipeline()
      keys.forEach(key => transaction.unlink(key))
      transaction.exec()
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
