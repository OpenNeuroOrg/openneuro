import { builder } from "../builder"
import { DatasetEventRef, DatasetRef, SnapshotRef, UserRef } from "./refs"
import { DatasetPermissions } from "./permissions"
import { Description, UpdateContributorsPayload } from "./description"
import { Summary } from "./metadata"
import { Metadata } from "./metadata"
import { UploadMetadata } from "./upload"
import {
  FileCheck,
  RepoMetadata,
  SyncDatasetDoisPayload,
  UserNotificationStatus,
} from "./misc"
import { DatasetReviewer } from "./reviewer"
import { WorkerTask } from "./worker"
import { FollowDatasetResponse, StarDatasetResponse } from "./misc"
import {
  AnalyticTypes,
  NotificationStatusType,
  RelatedObjectKind,
  RelatedObjectRelation,
  ResponseStatusType,
} from "./enums"
import {
  AnnexFsckInput,
  ContributorInput,
  DeleteFile,
  MetadataInput,
  SummaryInput,
  ValidatorInput,
  MosaicInput
} from "./inputs"

import Mutation from "../resolvers/mutation"

builder.mutationType({
  fields: (t) => ({
    createDataset: t.field({
      type: DatasetRef,
      args: {
        affirmedDefaced: t.arg.boolean(),
        affirmedConsent: t.arg.boolean(),
      },
      resolve: (root, args, ctx) =>
        Mutation.createDataset(root, args as never, ctx),
    }),
    deleteDataset: t.boolean({
      args: {
        id: t.arg.id({ required: true }),
        reason: t.arg.string(),
        redirect: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        Mutation.deleteDataset(root, args as never, ctx),
    }),
    createSnapshot: t.field({
      type: SnapshotRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
        changes: t.arg.stringList(),
      },
      resolve: (root, args, ctx) =>
        Mutation.createSnapshot(root, args as never, ctx),
    }),
    deleteSnapshot: t.boolean({
      nullable: false,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.deleteSnapshot(root, args as never, ctx),
    }),
    removeAnnexObject: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        snapshot: t.arg.string({ required: true }),
        annexKey: t.arg.string({ required: true }),
        path: t.arg.string(),
        filename: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        Mutation.removeAnnexObject(root, args as never, ctx),
    }),
    flagAnnexObject: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        snapshot: t.arg.string({ required: true }),
        filepath: t.arg.string({ required: true }),
        annexKey: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.flagAnnexObject(root, args as never, ctx),
    }),
    deleteFiles: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        files: t.arg({ type: [DeleteFile] }),
      },
      resolve: (root, args, ctx) =>
        Mutation.deleteFiles(root, args as never, ctx),
    }),
    updatePublic: t.boolean({
      nullable: false,
      args: {
        datasetId: t.arg.id({ required: true }),
        publicFlag: t.arg.boolean({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.updatePublic(root, args as never, ctx) as never,
    }),
    updateSummary: t.field({
      type: Summary,
      args: {
        summary: t.arg({ type: SummaryInput, required: true }),
      },
      resolve: (root, args) => Mutation.updateSummary(root, args as never),
    }),
    updateValidation: t.boolean({
      args: {
        validation: t.arg({ type: ValidatorInput, required: true }),
      },
      resolve: (root, args) => Mutation.updateValidation(root, args as never),
    }),
    updateMosaic: t.boolean({
      args: {
        mosaic: t.arg({ type: MosaicInput, required: true }),
      },
      resolve: (root, args) => Mutation.updateMosaic(root, args as never),
    }),
    updatePermissions: t.field({
      type: DatasetPermissions,
      args: {
        datasetId: t.arg.id({ required: true }),
        userEmail: t.arg.string({ required: true }),
        level: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.updatePermissions(root, args as never, ctx),
    }),
    updateOrcidPermissions: t.field({
      type: DatasetPermissions,
      args: {
        datasetId: t.arg.id({ required: true }),
        userOrcid: t.arg.string({ required: true }),
        level: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateOrcidPermissions(root, args as never, ctx),
    }),
    removePermissions: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        userId: t.arg.string({ required: true }),
      },
      resolve: (root, args) =>
        Mutation.removePermissions(root, args as never) as never,
    }),
    removeUser: t.boolean({
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.removeUser(root, args as never, ctx) as never,
    }),
    setAdmin: t.field({
      type: UserRef,
      args: {
        id: t.arg.id({ required: true }),
        admin: t.arg.boolean({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.setAdmin(root, args as never, ctx) as never,
    }),
    setBlocked: t.field({
      type: UserRef,
      args: {
        id: t.arg.id({ required: true }),
        blocked: t.arg.boolean({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.setBlocked(root, args as never, ctx) as never,
    }),
    updateUser: t.field({
      type: UserRef,
      args: {
        id: t.arg.id({ required: true }),
        location: t.arg.string(),
        institution: t.arg.string(),
        links: t.arg.stringList(),
        orcidConsent: t.arg.boolean(),
        profilePrivate: t.arg.boolean(),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateUser(root, args as never, ctx),
    }),
    trackAnalytics: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string(),
        type: t.arg({ type: AnalyticTypes }),
      },
      resolve: (root, args) => Mutation.trackAnalytics(root, args as never),
    }),
    followDataset: t.field({
      type: FollowDatasetResponse,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.followDataset(root, args as never, ctx),
    }),
    starDataset: t.field({
      type: StarDatasetResponse,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.starDataset(root, args as never, ctx),
    }),
    publishDataset: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.publishDataset(root, args as never, ctx),
    }),
    updateDescription: t.field({
      type: Description,
      args: {
        datasetId: t.arg.id({ required: true }),
        field: t.arg.string({ required: true }),
        value: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateDescription(root, args as never, ctx),
    }),
    updateDescriptionList: t.field({
      type: Description,
      args: {
        datasetId: t.arg.id({ required: true }),
        field: t.arg.string({ required: true }),
        value: t.arg.stringList(),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateDescriptionList(root, args as never, ctx),
    }),
    updateReadme: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        value: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateReadme(root, args as never, ctx),
    }),
    addComment: t.id({
      args: {
        datasetId: t.arg.id({ required: true }),
        parentId: t.arg.id(),
        comment: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.addComment(root, args as never, ctx),
    }),
    editComment: t.boolean({
      args: {
        commentId: t.arg.id({ required: true }),
        comment: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.editComment(root, args as never, ctx),
    }),
    deleteComment: t.stringList({
      nullable: { list: true, items: true },
      args: {
        commentId: t.arg.id({ required: true }),
        deleteChildren: t.arg.boolean(),
      },
      resolve: (root, args, ctx) =>
        Mutation.deleteComment(root, args as never, ctx),
    }),
    subscribeToNewsletter: t.boolean({
      args: {
        email: t.arg.string({ required: true }),
      },
      resolve: (root, args) =>
        Mutation.subscribeToNewsletter(root, args as never),
    }),
    addMetadata: t.field({
      type: Metadata,
      args: {
        datasetId: t.arg.id({ required: true }),
        metadata: t.arg({ type: MetadataInput, required: true }),
      },
      resolve: (root, args) => Mutation.addMetadata(root, args as never),
    }),
    prepareUpload: t.field({
      type: UploadMetadata,
      args: {
        datasetId: t.arg.id({ required: true }),
        uploadId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.prepareUpload(root, args as never, ctx) as never,
    }),
    finishUpload: t.boolean({
      args: {
        uploadId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.finishUpload(root, args as never, ctx),
    }),
    cacheClear: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.cacheClear(root as never, args as never, ctx),
    }),
    fsckDataset: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: Mutation.fsckDataset,
    }),
    holdDeletion: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        hold: t.arg.boolean({ required: true }),
      },
      resolve: Mutation.holdDeletion,
    }),
    revalidate: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        ref: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.revalidate(root, args as never, ctx),
    }),
    createMosaic: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        ref: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.createMosaic(root, args as never, ctx),
    }),
    prepareRepoAccess: t.field({
      type: RepoMetadata,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.prepareRepoAccess(root as never, args as never, ctx),
    }),
    reexportRemotes: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.reexportRemotes(root, args as never, ctx),
    }),
    resetDraft: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        ref: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.resetDraft(root, args as never, ctx),
    }),
    deprecateSnapshot: t.field({
      type: SnapshotRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
        reason: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.deprecateSnapshot(root, args as never, ctx) as never,
    }),
    undoDeprecateSnapshot: t.field({
      type: SnapshotRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.undoDeprecateSnapshot(root, args as never, ctx) as never,
    }),
    createReviewer: t.field({
      type: DatasetReviewer,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.createReviewer(root, args as never, ctx),
    }),
    deleteReviewer: t.field({
      type: DatasetReviewer,
      args: {
        datasetId: t.arg.id({ required: true }),
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.deleteReviewer(root, args as never, ctx),
    }),
    createRelation: t.field({
      type: DatasetRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        doi: t.arg.string({ required: true }),
        relation: t.arg({ type: RelatedObjectRelation, required: true }),
        kind: t.arg({ type: RelatedObjectKind, required: true }),
        description: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        Mutation.createRelation(root, args as never, ctx),
    }),
    deleteRelation: t.field({
      type: DatasetRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        doi: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.deleteRelation(root, args as never, ctx),
    }),
    importRemoteDataset: t.id({
      args: {
        datasetId: t.arg.id({ required: true }),
        url: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.importRemoteDataset(
          root as never,
          args as never,
          ctx,
        ),
    }),
    finishImportRemoteDataset: t.boolean({
      args: {
        id: t.arg.id({ required: true }),
        success: t.arg.boolean({ required: true }),
        message: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        Mutation.finishImportRemoteDataset(
          root as never,
          args as never,
          ctx,
        ),
    }),
    saveAdminNote: t.field({
      type: DatasetEventRef,
      args: {
        id: t.arg.id(),
        datasetId: t.arg.id({ required: true }),
        note: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.saveAdminNote(root, args as never, ctx),
    }),
    createGitEvent: t.field({
      type: DatasetEventRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        commit: t.arg.string({ required: true }),
        reference: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.createGitEvent(root, args as never, ctx),
    }),
    createContributorRequestEvent: t.field({
      type: DatasetEventRef,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.createContributorRequestEvent(
          root,
          args as never,
          ctx,
        ),
    }),
    processContributorRequest: t.field({
      type: DatasetEventRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        targetUserId: t.arg.id({ required: true }),
        requestId: t.arg.id({ required: true }),
        resolutionStatus: t.arg({ type: ResponseStatusType, required: true }),
        reason: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        Mutation.processContributorRequest(root, args as never, ctx),
    }),
    updateFileCheck: t.field({
      type: FileCheck,
      args: {
        datasetId: t.arg.id({ required: true }),
        hexsha: t.arg.string({ required: true }),
        refs: t.arg.stringList({ required: true }),
        annexFsck: t.arg({ type: [AnnexFsckInput], required: true }),
        remote: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateFileCheck(root, args as never, ctx),
    }),
    updateEventStatus: t.field({
      type: UserNotificationStatus,
      args: {
        eventId: t.arg.id({ required: true }),
        status: t.arg({ type: NotificationStatusType, required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateEventStatus(root, args as never, ctx),
    }),
    updateContributors: t.field({
      type: UpdateContributorsPayload,
      nullable: false,
      args: {
        datasetId: t.arg.string({ required: true }),
        newContributors: t.arg({ type: [ContributorInput], required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateContributors(root as never, args as never, ctx) as never,
    }),
    createContributorCitationEvent: t.field({
      type: DatasetEventRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        targetUserId: t.arg.id({ required: true }),
        contributorData: t.arg({ type: ContributorInput, required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.createContributorCitationEvent(
          root,
          args as never,
          ctx,
        ),
    }),
    processContributorCitation: t.field({
      type: DatasetEventRef,
      args: {
        eventId: t.arg.id({ required: true }),
        status: t.arg({ type: ResponseStatusType, required: true }),
      },
      resolve: (root, args, ctx) =>
        Mutation.processContributorCitation(root, args as never, ctx),
    }),
    updateWorkerTask: t.field({
      type: WorkerTask,
      args: {
        id: t.arg.id({ required: true }),
        args: t.arg({ type: "JSON" }),
        kwargs: t.arg({ type: "JSON" }),
        taskName: t.arg.string(),
        worker: t.arg.string(),
        queuedAt: t.arg({ type: "DateTime" }),
        startedAt: t.arg({ type: "DateTime" }),
        finishedAt: t.arg({ type: "DateTime" }),
        error: t.arg.string(),
        executionTime: t.arg.int(),
      },
      resolve: (root, args, ctx) =>
        Mutation.updateWorkerTask(root, args as never, ctx),
    }),
    syncDatasetDois: t.field({
      type: SyncDatasetDoisPayload,
      nullable: false,
      args: {
        datasetId: t.arg.id({ required: true }),
        dryRun: t.arg.boolean(),
      },
      resolve: (root, args, ctx) =>
        Mutation.syncDatasetDois(root, args as never, ctx) as never,
    }),
  }),
})
