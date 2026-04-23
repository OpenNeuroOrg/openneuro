import { builder } from "../builder"

export const DatasetReviewer = builder.simpleObject("DatasetReviewer", {
  description: "Anonymous dataset reviewer",
  fields: (t) => ({
    id: t.id({ nullable: false }),
    datasetId: t.id({ nullable: false }),
    expiration: t.field({ type: "DateTime" }),
    url: t.string({ nullable: false }),
  }),
})
