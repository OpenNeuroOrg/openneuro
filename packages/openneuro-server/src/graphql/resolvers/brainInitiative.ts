import { redis } from '../../libs/redis'
import type { DatasetOrSnapshot } from '../../utils/datasetOrSnapshot'
import { latestSnapshot } from './snapshots'
import { description } from '../../datalad/description'
import Metadata from '../../models/metadata'
import CacheItem, { CacheType } from '../../cache/item'
import * as Sentry from "@sentry/node"

const brainInitiativeMatch = new RegExp('brain.initiative', 'i')

/**
 * Check for any Brain Initiative metadata
 */
export const brainInitiative = async (
  dataset: DatasetOrSnapshot,
  _,
  context
): Promise<boolean> => {
  const cache = new CacheItem(redis, CacheType.brainInitiative, [dataset.id], 7200)
  return await cache.get(async () => {
    try {
      const metadata = await Metadata.findOne({ datasetId: dataset.id })
      if (metadata.grantFunderName.match(brainInitiativeMatch)) {
        return true
      } else {
        // Fetch snapshot if metadata didn't match
        const snapshot = await latestSnapshot(dataset, null, context)
        const snapshotDescription = await description(snapshot)
        for (const funding of snapshotDescription.Funding) {
          if (funding.match(brainInitiativeMatch)) {
            return true
          }
        }
      }
      return false
    } catch (_err) {
      Sentry.captureException(_err)
      return false
    }
  })
}
