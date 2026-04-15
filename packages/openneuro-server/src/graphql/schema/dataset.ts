import { builder } from "../builder"
import {
  CommentRef,
  DatasetEventRef,
  DatasetRef,
  DraftRef,
  SnapshotRef,
  UserRef,
} from "./refs"
import { PageInfo } from "./pagination"
import { DatasetPermissions } from "./permissions"
import { Analytic } from "./analytics"
import { DatasetCommit, DatasetDerivatives, Follower, Star } from "./misc"
import { Metadata } from "./metadata"
import { DatasetReviewer } from "./reviewer"
import {
  analytics,
  datasetName,
  followers,
  following,
  starred,
  stars,
} from "../resolvers/dataset"
import { user } from "../resolvers/user"
import { latestSnapshot, snapshots } from "../resolvers/snapshots"
import { permissions } from "../resolvers/permissions"
import { datasetComments } from "../resolvers/comment"
import { metadata } from "../resolvers/metadata"
import { history } from "../resolvers/history"
import { onBrainlife } from "../resolvers/brainlife"
import { brainInitiative } from "../resolvers/brainInitiative"
import { derivatives } from "../resolvers/derivatives"
import { reviewers } from "../resolvers/reviewer"
import { datasetEvents } from "../resolvers/datasetEvents"
import { getDatasetWorker } from "../../libs/datalad-service"
import { getDraftInfo } from "../../datalad/draft"

export const DatasetEdge = builder.simpleObject("DatasetEdge", {
  fields: (t) => ({
    id: t.string({ nullable: false }),
    node: t.field({ type: DatasetRef, nullable: false }),
    cursor: t.string({ nullable: false }),
  }),
})

export const DatasetConnection = builder.simpleObject("DatasetConnection", {
  fields: (t) => ({
    edges: t.field({
      type: [DatasetEdge],
      nullable: { list: true, items: true },
    }),
    pageInfo: t.field({ type: PageInfo, nullable: false }),
  }),
})

DatasetRef.implement({
  fields: (t) => ({
    id: t.id({ nullable: false, resolve: (obj) => obj.id }),
    created: t.field({
      type: "DateTime",
      nullable: false,
      resolve: (obj) => obj.created,
    }),
    uploader: t.field({
      type: UserRef,
      resolve: (obj, _args, ctx) =>
        user(null, { id: obj.uploader }, ctx),
    }),
    public: t.boolean({ resolve: (obj) => obj.public }),
    draft: t.field({
      type: DraftRef,
      resolve: async (obj) => {
        const draftHead = await getDraftInfo(obj.id)
        return {
          id: obj.id,
          revision: draftHead.ref,
          modified: new Date(draftHead.modified),
        }
      },
    }),
    snapshots: t.field({
      type: [SnapshotRef],
      nullable: { list: true, items: true },
      resolve: (obj) => snapshots(obj) as never,
    }),
    latestSnapshot: t.field({
      type: SnapshotRef,
      nullable: false,
      resolve: (obj, _args, ctx) => latestSnapshot(obj, null, ctx),
    }),
    permissions: t.field({
      type: DatasetPermissions,
      resolve: (obj, _args, ctx) => permissions(obj, null, ctx) as never,
    }),
    analytics: t.field({
      type: Analytic,
      resolve: (obj) => analytics(obj),
    }),
    stars: t.field({
      type: [Star],
      nullable: { list: true, items: true },
      resolve: (obj) => stars(obj),
    }),
    followers: t.field({
      type: [Follower],
      nullable: { list: true, items: true },
      resolve: (obj) => followers(obj),
    }),
    name: t.string({
      resolve: (obj) => datasetName(obj),
    }),
    comments: t.field({
      type: [CommentRef],
      nullable: { list: true, items: true },
      resolve: (obj) => datasetComments(obj),
    }),
    following: t.boolean({
      resolve: (obj, _args, ctx) => following(obj, _args, ctx),
    }),
    starred: t.boolean({
      resolve: (obj, _args, ctx) => starred(obj, _args, ctx),
    }),
    publishDate: t.field({
      type: "DateTime",
      resolve: (obj) => obj.publishDate,
    }),
    onBrainlife: t.boolean({
      directives: { cacheControl: { maxAge: 10080 } },
      resolve: (obj) => onBrainlife(obj as never) as never,
    }),
    derivatives: t.field({
      type: [DatasetDerivatives],
      nullable: { list: true, items: true },
      directives: { cacheControl: { maxAge: 3600 } },
      resolve: (obj) => derivatives(obj as never) as never,
    }),
    metadata: t.field({
      type: Metadata,
      resolve: (obj, _args, ctx) => metadata(obj, null, ctx),
    }),
    history: t.field({
      type: [DatasetCommit],
      nullable: { list: true, items: true },
      resolve: (obj) => history(obj),
    }),
    worker: t.string({
      resolve: (obj) => getDatasetWorker(obj.id),
    }),
    reviewers: t.field({
      type: [DatasetReviewer],
      nullable: { list: true, items: true },
      resolve: (obj, _args, ctx) => reviewers(obj, null, ctx),
    }),
    brainInitiative: t.boolean({
      resolve: (obj, _args, ctx) =>
        brainInitiative(obj as never, null, ctx) as never,
    }),
    events: t.field({
      type: [DatasetEventRef],
      nullable: { list: true, items: true },
      resolve: (obj, _args, ctx) => datasetEvents(obj, null, ctx),
    }),
  }),
})
