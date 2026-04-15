import { builder } from "../builder"
import { Severity } from "./enums"

export const DatasetFile = builder.simpleObject("DatasetFile", {
  description: "File metadata and link to contents",
  fields: (t) => ({
    id: t.id({ nullable: false }),
    filename: t.string({ nullable: false }),
    size: t.field({ type: "BigInt" }),
    annexed: t.boolean(),
    urls: t.stringList({ nullable: { list: true, items: true } }),
    directory: t.boolean(),
  }),
})

export const FilesUpdate = builder.simpleObject("FilesUpdate", {
  description: "Update to files",
  fields: (t) => ({
    datasetId: t.string(),
    action: t.string(),
    payload: t.field({
      type: [DatasetFile],
      nullable: { list: true, items: true },
    }),
  }),
})

export const ValidationIssueFile = builder.simpleObject("ValidationIssueFile", {
  fields: (t) => ({
    name: t.string(),
    path: t.string(),
    key: t.string({ nullable: false }),
    code: t.int(),
    file: t.field({ type: ValidationIssueFileDetail }),
    evidence: t.string(),
    line: t.int(),
    character: t.int(),
    severity: t.field({
      type: Severity,
      nullable: false,
    }),
    reason: t.string(),
    helpUrl: t.string(),
  }),
})

export const ValidationIssueFileDetail = builder.simpleObject(
  "ValidationIssueFileDetail",
  {
    fields: (t) => ({
      name: t.string(),
      path: t.string(),
      relativePath: t.string(),
    }),
  },
)
