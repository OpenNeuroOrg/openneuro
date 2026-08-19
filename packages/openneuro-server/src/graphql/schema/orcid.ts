import { builder } from "../builder"

export const OrcidWorkSyncResult = builder.simpleObject("OrcidWorkSyncResult", {
  description: "Outcome of publishing one dataset to an ORCID record",
  fields: (t) => ({
    datasetId: t.id({ nullable: false }),
    snapshotTag: t.string(),
    putCode: t.id(),
    action: t.string({
      nullable: false,
      description: "One of created, updated, unchanged, skipped or error",
    }),
    reason: t.string({
      description: "Why a dataset was skipped or failed to publish",
    }),
  }),
})

export const SyncOrcidWorksPayload = builder.simpleObject(
  "SyncOrcidWorksPayload",
  {
    fields: (t) => ({
      orcid: t.string({ nullable: false }),
      works: t.field({ type: [OrcidWorkSyncResult], nullable: false }),
      searchError: t.string({
        description:
          "Set when the search index could not be queried, uploaded datasets are still synced",
      }),
    }),
  },
)
