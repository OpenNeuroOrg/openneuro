import { builder } from "../builder"

export const Analytic = builder.simpleObject("Analytic", {
  description: "Analytics for a dataset",
  directives: { cacheControl: { maxAge: 300, scope: "PUBLIC" } },
  fields: (t) => ({
    datasetId: t.id({ nullable: false }),
    tag: t.string(),
    views: t.int(),
    downloads: t.int(),
  }),
})
