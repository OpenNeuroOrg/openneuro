/**
 * Publish the datasets a user has contributed to as works on their ORCID record.
 */
import * as Sentry from "@sentry/node"
import type { GraphQLContext } from "../builder"
import User from "../../models/user"
import OrcidWork from "../../models/orcidWork"
import { assembleMetadata } from "../../libs/doi/metadata"
import { hashObject } from "../../libs/authentication/crypto"
import {
  getOrcidAccessToken,
  OrcidAuthorizationError,
} from "../../libs/orcid/token"
import {
  createWork,
  getWorkSummaries,
  openNeuroWorkPutCodes,
  updateWork,
} from "../../libs/orcid/works"
import {
  buildOrcidWork,
  datasetExternalIdValue,
} from "../../libs/orcid/work-metadata"
import {
  eligibleDatasets,
  isDataciteContributor,
  latestUndeprecatedSnapshot,
  snapshotRevision,
} from "../../libs/orcid/eligible-datasets"

/** What the sync did with one dataset */
export type OrcidWorkSyncAction =
  | "created"
  | "updated"
  | "unchanged"
  | "skipped"
  | "error"

export interface OrcidWorkSyncResult {
  datasetId: string
  snapshotTag: string | null
  putCode: string | null
  action: OrcidWorkSyncAction
  reason: string | null
}

export interface SyncOrcidWorksPayload {
  orcid: string
  works: OrcidWorkSyncResult[]
  searchError: string | null
}

/**
 * Publish or refresh the ORCID work for one dataset.
 *
 * Idempotency comes from two places, the put-code we recorded the last time
 * this dataset was published and the put-codes already on the ORCID record
 * keyed by the dataset URL. The second recovers works whose local record was
 * lost so a repeated sync updates rather than duplicates.
 */
const syncDatasetWork = async (
  {
    datasetId,
    orcid,
    userId,
    accessToken,
    knownPutCodes,
    dryRun,
    requireDataciteContributor,
  }: {
    datasetId: string
    orcid: string
    userId: string
    accessToken: string
    knownPutCodes: Map<string, number>
    dryRun: boolean
    requireDataciteContributor: boolean
  },
): Promise<OrcidWorkSyncResult> => {
  const snapshot = await latestUndeprecatedSnapshot(datasetId)
  if (!snapshot) {
    return {
      datasetId,
      snapshotTag: null,
      putCode: null,
      action: "skipped",
      reason: "No snapshot available that has not been deprecated",
    }
  }

  const revision = await snapshotRevision(datasetId, snapshot)

  // The search index only nominates candidates, datacite.yml decides
  if (
    requireDataciteContributor &&
    !(await isDataciteContributor(datasetId, snapshot.tag, revision, orcid))
  ) {
    return {
      datasetId,
      snapshotTag: snapshot.tag,
      putCode: null,
      action: "skipped",
      reason: "ORCID iD is not listed in datacite.yml for this snapshot",
    }
  }

  const attributes = await assembleMetadata(
    datasetId,
    snapshot.tag,
    revision,
    snapshot.created,
  )
  const work = buildOrcidWork(
    datasetId,
    attributes,
    new Date(snapshot.created * 1000),
  )
  const hash = hashObject(work)

  const record = await OrcidWork.findOne({ userId, datasetId }).lean().exec()
  const putCode = record?.putCode ??
    knownPutCodes.get(datasetExternalIdValue(datasetId)) ?? null

  if (putCode !== null && record?.putCode === putCode && record.hash === hash) {
    return {
      datasetId,
      snapshotTag: snapshot.tag,
      putCode: String(putCode),
      action: "unchanged",
      reason: null,
    }
  }

  if (dryRun) {
    return {
      datasetId,
      snapshotTag: snapshot.tag,
      putCode: putCode === null ? null : String(putCode),
      action: putCode === null ? "created" : "updated",
      reason: null,
    }
  }

  let action: OrcidWorkSyncAction
  let resultPutCode: number
  if (putCode === null) {
    resultPutCode = await createWork(orcid, accessToken, work)
    action = "created"
  } else {
    await updateWork(orcid, accessToken, putCode, work)
    resultPutCode = putCode
    action = "updated"
  }

  await OrcidWork.updateOne(
    { userId, datasetId },
    {
      $set: {
        userId,
        orcid,
        datasetId,
        putCode: resultPutCode,
        snapshotTag: snapshot.tag,
        doi: attributes.doi,
        hash,
      },
    },
    { upsert: true },
  )

  return {
    datasetId,
    snapshotTag: snapshot.tag,
    putCode: String(resultPutCode),
    action,
    reason: null,
  }
}

/**
 * Publish every eligible dataset for the authenticated user as an ORCID work.
 *
 * Safe to call repeatedly, each dataset maps to exactly one work which is
 * updated in place when its latest undeprecated snapshot changes.
 */
export const syncOrcidWorks = async (
  _obj,
  { dryRun = false }: { dryRun?: boolean },
  { userInfo }: GraphQLContext,
): Promise<SyncOrcidWorksPayload> => {
  if (!userInfo?.id) {
    throw new Error("You must be logged in to publish works to ORCID.")
  }

  const user = await User.findOne({ id: userInfo.id }).exec()
  if (!user) {
    throw new Error("You must be logged in to publish works to ORCID.")
  }
  if (!user.orcid) {
    throw new Error(
      "Link an ORCID iD to your account to publish works to ORCID.",
    )
  }
  if (user.orcidConsent !== true) {
    throw new Error(
      "Consent to publishing datasets to your ORCID record is required.",
    )
  }

  const accessToken = await getOrcidAccessToken(user)
  const { candidates, searchError } = await eligibleDatasets(
    user.id,
    user.orcid,
  )

  // Works already on the record let us adopt anything we have lost track of
  let knownPutCodes: Map<string, number>
  try {
    knownPutCodes = openNeuroWorkPutCodes(
      await getWorkSummaries(user.orcid, accessToken),
    )
  } catch (err) {
    if (err instanceof OrcidAuthorizationError) throw err
    // Creating a duplicate is worse than failing, so do not continue blind
    Sentry.captureException(err)
    throw new Error(
      `Could not read existing works from ORCID: ${err.message}`,
      {
        cause: err,
      },
    )
  }

  const works: OrcidWorkSyncResult[] = []
  for (const [datasetId, kind] of candidates) {
    try {
      works.push(
        await syncDatasetWork({
          datasetId,
          orcid: user.orcid,
          userId: user.id,
          accessToken,
          knownPutCodes,
          dryRun,
          requireDataciteContributor: kind === "contributor",
        }),
      )
    } catch (err) {
      Sentry.captureException(err)
      works.push({
        datasetId,
        snapshotTag: null,
        putCode: null,
        action: "error",
        reason: String(err),
      })
    }
  }

  return { orcid: user.orcid, works, searchError }
}
