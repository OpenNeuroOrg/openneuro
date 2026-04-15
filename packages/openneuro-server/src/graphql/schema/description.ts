import { builder } from "../builder"
import { DatasetRef } from "./refs"

export const Description = builder.simpleObject("Description", {
  description: "Contents of dataset_description.json",
  directives: { cacheControl: { maxAge: 30, scope: "PUBLIC" } },
  fields: (t) => ({
    id: t.id({ nullable: false }),
    Name: t.string({ nullable: false }),
    BIDSVersion: t.string({ nullable: false }),
    License: t.string(),
    Authors: t.stringList(),
    SeniorAuthor: t.string(),
    Acknowledgements: t.string(),
    HowToAcknowledge: t.string(),
    Funding: t.stringList(),
    ReferencesAndLinks: t.stringList(),
    DatasetDOI: t.string(),
    DatasetType: t.string(),
    EthicsApprovals: t.stringList(),
  }),
})

export const Contributor = builder.simpleObject("Contributor", {
  description: "Defines the Contributor type in contributors.ts",
  fields: (t) => ({
    name: t.string({ nullable: false }),
    givenName: t.string(),
    familyName: t.string(),
    orcid: t.string(),
    contributorType: t.string({ nullable: false }),
    order: t.int(),
  }),
})

export const UpdateContributorsPayload = builder.simpleObject(
  "UpdateContributorsPayload",
  {
    fields: (t) => ({
      success: t.boolean({ nullable: false }),
      dataset: t.field({ type: DatasetRef }),
    }),
  },
)
