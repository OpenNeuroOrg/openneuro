import { builder } from "../builder"
import { DatasetConnection } from "./dataset"
import { DatasetRef, SnapshotRef, UserRef } from "./refs"
import { UserList } from "./user"
import { FlaggedFile } from "./misc"
import { Metadata } from "./metadata"
import { DatasetFilter, DatasetSort, UserSortInput } from "./inputs"
import { dataset, datasets } from "../resolvers/dataset"
import { user, users } from "../resolvers/user"
import { participantCount, snapshot } from "../resolvers/snapshots"
import { flaggedFiles } from "../resolvers/flaggedFiles"
import { publicMetadata } from "../resolvers/metadata"

builder.queryType({
  fields: (t) => ({
    dataset: t.field({
      type: DatasetRef,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        dataset(root, args as never, ctx as never) as never,
    }),
    datasets: t.field({
      type: DatasetConnection,
      args: {
        first: t.arg.int({ defaultValue: 25 }),
        after: t.arg.string(),
        before: t.arg.string(),
        orderBy: t.arg({
          type: DatasetSort,
          defaultValue: { created: "ascending" },
        }),
        filterBy: t.arg({ type: DatasetFilter, defaultValue: {} }),
        myDatasets: t.arg.boolean(),
        modality: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        datasets(root, args as never, ctx as never) as never,
    }),
    user: t.field({
      type: UserRef,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        user(root, args as never, ctx as never) as never,
    }),
    users: t.field({
      type: UserList,
      nullable: false,
      args: {
        orderBy: t.arg({ type: [UserSortInput] }),
        isAdmin: t.arg.boolean(),
        isBlocked: t.arg.boolean(),
        search: t.arg.string(),
        limit: t.arg.int(),
        offset: t.arg.int(),
      },
      resolve: (root, args, ctx) =>
        users(root, args as never, ctx as never) as never,
    }),
    participantCount: t.int({
      directives: { cacheControl: { maxAge: 3600, scope: "PUBLIC" } },
      args: {
        modality: t.arg.string(),
      },
      resolve: (root, args) => participantCount(root, args as never) as never,
    }),
    snapshot: t.field({
      type: SnapshotRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        snapshot(root, args as never, ctx as never) as never,
    }),
    flaggedFiles: t.field({
      type: [FlaggedFile],
      nullable: { list: true, items: true },
      args: {
        flagged: t.arg.boolean({ defaultValue: true }),
        deleted: t.arg.boolean({ defaultValue: false }),
      },
      resolve: (root, args, ctx) =>
        flaggedFiles(root, args as never, ctx as never) as never,
    }),
    publicMetadata: t.field({
      type: [Metadata],
      nullable: { list: true, items: true },
      directives: { cacheControl: { maxAge: 86400, scope: "PUBLIC" } },
      resolve: (root) => publicMetadata(root) as never,
    }),
    orcidConsent: t.boolean({
      resolve: (_root, _args, ctx) => ctx.userInfo?.orcidConsent ?? null,
    }),
  }),
})
