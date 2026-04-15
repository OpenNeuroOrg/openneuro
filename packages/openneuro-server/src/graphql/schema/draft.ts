import { DatasetRef, DraftRef } from "./refs"
import { Summary } from "./metadata"
import { ValidationIssue, ValidationIssueStatus } from "./validation"
import { DatasetValidation } from "./validation"
import { DatasetFile } from "./files"
import { Description } from "./description"
import { Contributor } from "./description"
import { UploadMetadata } from "./upload"
import { FileCheck } from "./misc"
import DraftFields, { draftFiles, fileCheck } from "../resolvers/draft"

DraftRef.implement({
  fields: (t) => ({
    id: t.id({ resolve: (obj) => obj.id }),
    dataset: t.field({
      type: DatasetRef,
      resolve: (obj) => ({ id: obj.id }) as never,
    }),
    modified: t.field({
      type: "DateTime",
      resolve: (obj) =>
        obj.modified ? (obj.modified as unknown as string) : null,
    }),
    summary: t.field({
      type: Summary,
      resolve: (obj) => DraftFields.summary(obj) as never,
    }),
    issues: t.field({
      type: [ValidationIssue],
      resolve: (obj, _args, ctx) => DraftFields.issues(obj, null, ctx),
    }),
    issuesStatus: t.field({
      type: ValidationIssueStatus,
      resolve: (obj) => DraftFields.issuesStatus(obj),
    }),
    validation: t.field({
      type: DatasetValidation,
      resolve: (obj, _args, ctx) =>
        DraftFields.validation(obj, null, ctx) as never,
    }),
    files: t.field({
      type: [DatasetFile],
      args: {
        tree: t.arg.string(),
        recursive: t.arg.boolean(),
      },
      resolve: (obj, args, ctx) => draftFiles(obj, args, ctx),
    }),
    description: t.field({
      type: Description,
      resolve: (obj) => DraftFields.description(obj),
    }),
    readme: t.string({
      resolve: (obj) => DraftFields.readme(obj),
    }),
    uploads: t.field({
      type: [UploadMetadata],
      resolve: () => null,
    }),
    head: t.string({
      resolve: (obj) => DraftFields.head(obj),
    }),
    size: t.field({
      type: "BigInt",
      resolve: (obj, _args, ctx) => DraftFields.size(obj, null, ctx) as never,
    }),
    fileCheck: t.field({
      type: FileCheck,
      resolve: (obj) => fileCheck(obj),
    }),
    contributors: t.field({
      type: [Contributor],
      resolve: (obj) => DraftFields.contributors(obj),
    }),
  }),
})
