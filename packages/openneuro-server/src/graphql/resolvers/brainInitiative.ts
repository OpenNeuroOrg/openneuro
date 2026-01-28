import { redis } from "../../libs/redis"
import type { DatasetOrSnapshot } from "../../utils/datasetOrSnapshot"
import { latestSnapshot } from "./snapshots"
import { description } from "../../datalad/description"
import Metadata from "../../models/metadata"
import CacheItem, { CacheType } from "../../cache/item"
import * as Sentry from "@sentry/node"
import fundedAwards from "../../data/funded_awards.json"

const brainInitiativeMatch = new RegExp("brain.initiative", "i")

const brainInitiativeGrants = fundedAwards.map((award) =>
  award.field_project_number.replace(/[^a-zA-Z0-9]/g, "")
)

/**
 * Check for any Brain Initiative metadata
 */
export const brainInitiative = async (
  dataset: DatasetOrSnapshot,
  _,
  context,
): Promise<boolean> => {
  const cache = new CacheItem(
    redis,
    CacheType.brainInitiative,
    [dataset.id],
    86400,
  )
  return await cache.get(async () => {
    try {
      const metadata = await Metadata.findOne({ datasetId: dataset.id })
      if (metadata?.grantFunderName?.match(brainInitiativeMatch)) {
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
        // Check for grant ids too - filter to only alphanumeric to improve matching across format differences
        const identifier = metadata?.grantIdentifier?.replace(
          /[^a-zA-Z0-9]/g,
          "",
        )
        if (!identifier) {
          return false
        }
        for (const grant of brainInitiativeGrants) {
          if (
            identifier.includes(grant)
          ) {
            return true
          }
          for (const funding of snapshotDescription.Funding) {
            if (funding.replace(/[^a-zA-Z0-9]/g, "").includes(grant)) {
              return true
            }
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
