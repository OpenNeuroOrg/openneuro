import { checkAdmin } from "../permissions"
import type { GraphQLContext } from "../builder"
import { getSnapshots } from "../../datalad/snapshots"
import Doi from "../../models/doi"
import DeprecatedSnapshot from "../../models/deprecatedSnapshot"
import { assembleMetadata } from "../../libs/doi/metadata"
import { buildPayload, hideDoi, upsertDoi } from "../../libs/doi/index"

export interface SnapshotDoiSyncResult {
  tag: string
  doi: string | null
  deprecated: boolean
  action: string
  datacite: object | null
  error: string | null
}

export const syncDatasetDois = async (
  _obj,
  { datasetId, dryRun = false }: { datasetId: string; dryRun?: boolean },
  { user, userInfo }: GraphQLContext,
) => {
  await checkAdmin(user, userInfo)

  const snapshots = await getSnapshots(datasetId)
  if (!snapshots) return { snapshots: [] }

  const results: SnapshotDoiSyncResult[] = []

  for (const snapshot of snapshots) {
    const { tag } = snapshot
    const deprecatedSnapshotId = `${datasetId}:${tag}`

    const doiRecord = await Doi.findOne({ datasetId, snapshotId: tag })
      .lean()
      .exec()
    if (!doiRecord) {
      results.push({
        tag,
        doi: null,
        deprecated: false,
        action: "skip",
        datacite: null,
        error: null,
      })
      continue
    }

    const deprecatedRecord = await DeprecatedSnapshot.findOne({
      id: deprecatedSnapshotId,
    })
      .lean()
      .exec()
    const isDeprecated = !!deprecatedRecord

    let action: string
    let datacite: object | null = null
    let error: string | null = null

    if (isDeprecated) {
      if (doiRecord.state === "findable") {
        action = "hide"
        if (!dryRun) {
          try {
            await hideDoi(doiRecord.doi)
            await Doi.updateOne(
              { datasetId, snapshotId: tag },
              { state: "registered" },
            )
          } catch (e) {
            action = "error"
            error = String(e)
          }
        }
      } else {
        action = "skip"
      }
    } else {
      action = "update_metadata"
      try {
        const attributes = await assembleMetadata(datasetId, tag, tag)
        datacite = attributes
        if (!dryRun) {
          const payload = buildPayload(attributes)
          await upsertDoi(payload)
        }
      } catch (e) {
        action = "error"
        error = String(e)
      }
    }

    results.push({
      tag,
      doi: doiRecord.doi,
      deprecated: isDeprecated,
      action,
      datacite,
      error,
    })
  }

  return { snapshots: results }
}
