import { DatasetRef, SnapshotRef } from "./refs"
import { Summary } from "./metadata"
import {
  DatasetValidation,
  ValidationIssue,
  ValidationIssueStatus,
} from "./validation"
import { DatasetFile } from "./files"
import { Description } from "./description"
import { Contributor } from "./description"
import { Analytic } from "./analytics"
import { DeprecatedSnapshot, RelatedObject } from "./misc"
import SnapshotFields from "../resolvers/snapshots"

SnapshotRef.implement({
  directives: { cacheControl: { maxAge: 3600, scope: "PUBLIC" } },
  fields: (t) => ({
    id: t.id({ nullable: false, resolve: (obj) => obj.id }),
    tag: t.string({ nullable: false, resolve: (obj) => obj.tag }),
    dataset: t.field({
      type: DatasetRef,
      nullable: false,
      resolve: (obj) => obj.dataset() as never,
    }),
    created: t.field({
      type: "DateTime",
      resolve: (obj) => obj.created ?? null,
    }),
    summary: t.field({
      type: Summary,
      resolve: (obj) => obj.summary() as never,
    }),
    issues: t.field({
      type: [ValidationIssue],
      resolve: (obj) => SnapshotFields.issues(obj),
    }),
    issuesStatus: t.field({
      type: ValidationIssueStatus,
      resolve: (obj) => SnapshotFields.issuesStatus(obj),
    }),
    validation: t.field({
      type: DatasetValidation,
      resolve: (obj, _args, ctx) =>
        SnapshotFields.validation(obj, null, ctx) as never,
    }),
    files: t.field({
      type: [DatasetFile],
      args: {
        tree: t.arg.string(),
        recursive: t.arg.boolean(),
      },
      resolve: (obj, args) =>
        (typeof obj.files === "function"
          ? obj.files({ tree: args.tree, recursive: args.recursive })
          : obj.files) as never,
    }),
    description: t.field({
      type: Description,
      resolve: (obj) =>
        typeof obj.description === "function"
          ? obj.description()
          : obj.description,
    }),
    analytics: t.field({
      type: Analytic,
      resolve: (obj) => SnapshotFields.analytics(obj),
    }),
    readme: t.string({
      directives: { cacheControl: { maxAge: 31536000, scope: "PUBLIC" } },
      resolve: (obj) =>
        (typeof obj.readme === "function" ? obj.readme() : obj.readme) as never,
    }),
    hexsha: t.string({
      resolve: (obj) => obj.hexsha ?? null,
    }),
    deprecated: t.field({
      type: DeprecatedSnapshot,
      resolve: (obj) =>
        typeof obj.deprecated === "function"
          ? obj.deprecated()
          : obj.deprecated,
    }),
    related: t.field({
      type: [RelatedObject],
      resolve: (obj) =>
        (typeof obj.related === "function"
          ? obj.related()
          : obj.related) as never,
    }),
    onBrainlife: t.boolean({
      directives: { cacheControl: { maxAge: 10080, scope: "PUBLIC" } },
      resolve: (obj) =>
        typeof obj.onBrainlife === "function"
          ? obj.onBrainlife()
          : obj.onBrainlife,
    }),
    size: t.field({
      type: "BigInt",
      resolve: (obj) =>
        (typeof obj.size === "function" ? obj.size() : obj.size) as never,
    }),
    contributors: t.field({
      type: [Contributor],
      resolve: (obj) => SnapshotFields.contributors(obj),
    }),
  }),
})
