import { builder } from "../builder"

export const UploadMetadata = builder.simpleObject("UploadMetadata", {
  description: "Client metadata needed to complete an upload",
  fields: (t) => ({
    id: t.id({ nullable: false }),
    datasetId: t.id({ nullable: false }),
    complete: t.boolean({ nullable: false }),
    estimatedSize: t.field({ type: "BigInt" }),
    token: t.string(),
    endpoint: t.int(),
  }),
})
