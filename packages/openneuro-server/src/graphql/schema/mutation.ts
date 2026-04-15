import { builder } from "../builder"
import { DatasetEventRef, DatasetRef, SnapshotRef, UserRef } from "./refs"
import { DatasetPermissions } from "./permissions"
import { Description, UpdateContributorsPayload } from "./description"
import { Summary } from "./metadata"
import { Metadata } from "./metadata"
import { UploadMetadata } from "./upload"
import { FileCheck, RepoMetadata, UserNotificationStatus } from "./misc"
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
} from "./inputs"

// Resolvers — dataset
import {
  createDataset,
  deleteDataset,
  deleteFiles,
  flagAnnexObject,
  removeAnnexObject,
  trackAnalytics,
  updatePublic,
} from "../resolvers/dataset"
// Resolvers — snapshots
import {
  createSnapshot,
  deleteSnapshot,
  deprecateSnapshot,
  undoDeprecateSnapshot,
} from "../resolvers/snapshots"
// Resolvers — user
import { removeUser, setAdmin, setBlocked, updateUser } from "../resolvers/user"
// Resolvers — summary & validation
import { updateSummary } from "../resolvers/summary"
import { revalidate, updateValidation } from "../resolvers/validation"
// Resolvers — permissions
import {
  removePermissions,
  updateOrcidPermissions,
  updatePermissions,
} from "../resolvers/permissions"
// Resolvers — social
import { followDataset } from "../resolvers/follow"
import { starDataset } from "../resolvers/stars"
import { publishDataset } from "../resolvers/publish"
// Resolvers — content
import {
  updateDescription,
  updateDescriptionList,
} from "../resolvers/description"
import { updateReadme } from "../resolvers/readme"
import { addComment, deleteComment, editComment } from "../resolvers/comment"
import { subscribeToNewsletter } from "../resolvers/newsletter"
import { addMetadata } from "../resolvers/metadata"
// Resolvers — upload & git
import { finishUpload, prepareUpload } from "../resolvers/upload"
import { prepareRepoAccess } from "../resolvers/git"
import { cacheClear } from "../resolvers/cache"
// Resolvers — maintenance
import { reexportRemotes } from "../resolvers/reexporter"
import { resetDraft } from "../resolvers/reset"
import { createReviewer, deleteReviewer } from "../resolvers/reviewer"
import { createRelation, deleteRelation } from "../resolvers/relation"
import {
  finishImportRemoteDataset,
  importRemoteDataset,
} from "../resolvers/importRemoteDataset"
// Resolvers — events
import {
  createContributorCitationEvent,
  createContributorRequestEvent,
  processContributorCitation,
  processContributorRequest,
  saveAdminNote,
  updateEventStatus,
} from "../resolvers/datasetEvents"
import { createGitEvent } from "../resolvers/gitEvents"
import { fsckDataset, updateFileCheck } from "../resolvers/fileCheck"
import { updateContributors } from "../../datalad/contributors"
import { updateWorkerTask } from "../resolvers/worker"

builder.mutationType({
  fields: (t) => ({
    createDataset: t.field({
      type: DatasetRef,
      args: {
        affirmedDefaced: t.arg.boolean(),
        affirmedConsent: t.arg.boolean(),
      },
      resolve: (root, args, ctx) =>
        createDataset(root, args as never, ctx) as never,
    }),
    deleteDataset: t.boolean({
      args: {
        id: t.arg.id({ required: true }),
        reason: t.arg.string(),
        redirect: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        deleteDataset(root, args as never, ctx) as never,
    }),
    createSnapshot: t.field({
      type: SnapshotRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
        changes: t.arg.stringList(),
      },
      resolve: (root, args, ctx) =>
        createSnapshot(root, args as never, ctx as never) as never,
    }),
    deleteSnapshot: t.boolean({
      nullable: false,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        deleteSnapshot(root, args as never, ctx as never) as never,
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
        removeAnnexObject(root, args as never, ctx) as never,
    }),
    flagAnnexObject: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        snapshot: t.arg.string({ required: true }),
        filepath: t.arg.string({ required: true }),
        annexKey: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        flagAnnexObject(root, args as never, ctx) as never,
    }),
    deleteFiles: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        files: t.arg({ type: [DeleteFile] }),
      },
      resolve: (root, args, ctx) =>
        deleteFiles(root, args as never, ctx) as never,
    }),
    updatePublic: t.boolean({
      nullable: false,
      args: {
        datasetId: t.arg.id({ required: true }),
        publicFlag: t.arg.boolean({ required: true }),
      },
      resolve: (root, args, ctx) =>
        updatePublic(root, args as never, ctx) as never,
    }),
    updateSummary: t.field({
      type: Summary,
      args: {
        summary: t.arg({ type: SummaryInput, required: true }),
      },
      resolve: (root, args) => updateSummary(root, args as never) as never,
    }),
    updateValidation: t.boolean({
      args: {
        validation: t.arg({ type: ValidatorInput, required: true }),
      },
      resolve: (root, args) => updateValidation(root, args as never) as never,
    }),
    updatePermissions: t.field({
      type: DatasetPermissions,
      args: {
        datasetId: t.arg.id({ required: true }),
        userEmail: t.arg.string({ required: true }),
        level: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        updatePermissions(root, args as never, ctx) as never,
    }),
    updateOrcidPermissions: t.field({
      type: DatasetPermissions,
      args: {
        datasetId: t.arg.id({ required: true }),
        userOrcid: t.arg.string({ required: true }),
        level: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        updateOrcidPermissions(root, args as never, ctx) as never,
    }),
    removePermissions: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        userId: t.arg.string({ required: true }),
      },
      resolve: (root, args) => removePermissions(root, args as never) as never,
    }),
    removeUser: t.boolean({
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        removeUser(root, args as never, ctx as never) as never,
    }),
    setAdmin: t.field({
      type: UserRef,
      args: {
        id: t.arg.id({ required: true }),
        admin: t.arg.boolean({ required: true }),
      },
      resolve: (root, args, ctx) =>
        setAdmin(root, args as never, ctx as never) as never,
    }),
    setBlocked: t.field({
      type: UserRef,
      args: {
        id: t.arg.id({ required: true }),
        blocked: t.arg.boolean({ required: true }),
      },
      resolve: (root, args, ctx) =>
        setBlocked(root, args as never, ctx as never) as never,
    }),
    updateUser: t.field({
      type: UserRef,
      args: {
        id: t.arg.id({ required: true }),
        location: t.arg.string(),
        institution: t.arg.string(),
        links: t.arg.stringList(),
        orcidConsent: t.arg.boolean(),
      },
      resolve: (root, args, ctx) =>
        updateUser(root, args as never, ctx as never) as never,
    }),
    trackAnalytics: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string(),
        type: t.arg({ type: AnalyticTypes }),
      },
      resolve: (root, args) => trackAnalytics(root, args as never) as never,
    }),
    followDataset: t.field({
      type: FollowDatasetResponse,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        followDataset(root, args as never, ctx as never) as never,
    }),
    starDataset: t.field({
      type: StarDatasetResponse,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        starDataset(root, args as never, ctx as never) as never,
    }),
    publishDataset: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        publishDataset(root, args as never, ctx as never) as never,
    }),
    updateDescription: t.field({
      type: Description,
      args: {
        datasetId: t.arg.id({ required: true }),
        field: t.arg.string({ required: true }),
        value: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        updateDescription(root, args as never, ctx as never) as never,
    }),
    updateDescriptionList: t.field({
      type: Description,
      args: {
        datasetId: t.arg.id({ required: true }),
        field: t.arg.string({ required: true }),
        value: t.arg.stringList({ required: true }),
      },
      resolve: (root, args, ctx) =>
        updateDescriptionList(root, args as never, ctx as never) as never,
    }),
    updateReadme: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        value: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        updateReadme(root, args as never, ctx as never) as never,
    }),
    addComment: t.id({
      args: {
        datasetId: t.arg.id({ required: true }),
        parentId: t.arg.id(),
        comment: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        addComment(root, args as never, ctx as never) as never,
    }),
    editComment: t.boolean({
      args: {
        commentId: t.arg.id({ required: true }),
        comment: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        editComment(root, args as never, ctx as never) as never,
    }),
    deleteComment: t.stringList({
      nullable: { list: true, items: true },
      args: {
        commentId: t.arg.id({ required: true }),
        deleteChildren: t.arg.boolean(),
      },
      resolve: (root, args, ctx) =>
        deleteComment(root, args as never, ctx as never) as never,
    }),
    subscribeToNewsletter: t.boolean({
      args: {
        email: t.arg.string({ required: true }),
      },
      resolve: (root, args) =>
        subscribeToNewsletter(root, args as never) as never,
    }),
    addMetadata: t.field({
      type: Metadata,
      args: {
        datasetId: t.arg.id({ required: true }),
        metadata: t.arg({ type: MetadataInput, required: true }),
      },
      resolve: (root, args) => addMetadata(root, args as never) as never,
    }),
    prepareUpload: t.field({
      type: UploadMetadata,
      args: {
        datasetId: t.arg.id({ required: true }),
        uploadId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        prepareUpload(root, args as never, ctx as never) as never,
    }),
    finishUpload: t.boolean({
      args: {
        uploadId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        finishUpload(root, args as never, ctx as never) as never,
    }),
    cacheClear: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        cacheClear(root as never, args as never, ctx as never) as never,
    }),
    fsckDataset: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        fsckDataset(root, args as never, ctx as never) as never,
    }),
    revalidate: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        ref: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        revalidate(root, args as never, ctx as never) as never,
    }),
    prepareRepoAccess: t.field({
      type: RepoMetadata,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        prepareRepoAccess(root as never, args as never, ctx as never) as never,
    }),
    reexportRemotes: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        reexportRemotes(root, args as never, ctx as never) as never,
    }),
    resetDraft: t.boolean({
      args: {
        datasetId: t.arg.id({ required: true }),
        ref: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        resetDraft(root, args as never, ctx as never) as never,
    }),
    deprecateSnapshot: t.field({
      type: SnapshotRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
        reason: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        deprecateSnapshot(root, args as never, ctx as never) as never,
    }),
    undoDeprecateSnapshot: t.field({
      type: SnapshotRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        undoDeprecateSnapshot(root, args as never, ctx as never) as never,
    }),
    createReviewer: t.field({
      type: DatasetReviewer,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        createReviewer(root, args as never, ctx) as never,
    }),
    deleteReviewer: t.field({
      type: DatasetReviewer,
      args: {
        datasetId: t.arg.id({ required: true }),
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        deleteReviewer(root, args as never, ctx) as never,
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
        createRelation(root, args as never, ctx as never) as never,
    }),
    deleteRelation: t.field({
      type: DatasetRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        doi: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        deleteRelation(root, args as never, ctx as never) as never,
    }),
    importRemoteDataset: t.id({
      args: {
        datasetId: t.arg.id({ required: true }),
        url: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        importRemoteDataset(
          root as never,
          args as never,
          ctx as never,
        ) as never,
    }),
    finishImportRemoteDataset: t.boolean({
      args: {
        id: t.arg.id({ required: true }),
        success: t.arg.boolean({ required: true }),
        message: t.arg.string(),
      },
      resolve: (root, args, ctx) =>
        finishImportRemoteDataset(
          root as never,
          args as never,
          ctx as never,
        ) as never,
    }),
    saveAdminNote: t.field({
      type: DatasetEventRef,
      args: {
        id: t.arg.id(),
        datasetId: t.arg.id({ required: true }),
        note: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        saveAdminNote(root, args as never, ctx) as never,
    }),
    createGitEvent: t.field({
      type: DatasetEventRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        commit: t.arg.string({ required: true }),
        reference: t.arg.string({ required: true }),
      },
      resolve: (root, args, ctx) =>
        createGitEvent(root, args as never, ctx as never) as never,
    }),
    createContributorRequestEvent: t.field({
      type: DatasetEventRef,
      args: {
        datasetId: t.arg.id({ required: true }),
      },
      resolve: (root, args, ctx) =>
        createContributorRequestEvent(
          root,
          args as never,
          ctx as never,
        ) as never,
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
        processContributorRequest(root, args as never, ctx as never) as never,
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
        updateFileCheck(root, args as never, ctx as never) as never,
    }),
    updateEventStatus: t.field({
      type: UserNotificationStatus,
      args: {
        eventId: t.arg.id({ required: true }),
        status: t.arg({ type: NotificationStatusType, required: true }),
      },
      resolve: (root, args, ctx) =>
        updateEventStatus(root, args as never, ctx as never) as never,
    }),
    updateContributors: t.field({
      type: UpdateContributorsPayload,
      nullable: false,
      args: {
        datasetId: t.arg.string({ required: true }),
        newContributors: t.arg({ type: [ContributorInput], required: true }),
      },
      resolve: (root, args, ctx) =>
        updateContributors(root as never, args as never, ctx) as never,
    }),
    createContributorCitationEvent: t.field({
      type: DatasetEventRef,
      args: {
        datasetId: t.arg.id({ required: true }),
        targetUserId: t.arg.id({ required: true }),
        contributorData: t.arg({ type: ContributorInput, required: true }),
      },
      resolve: (root, args, ctx) =>
        createContributorCitationEvent(
          root,
          args as never,
          ctx as never,
        ) as never,
    }),
    processContributorCitation: t.field({
      type: DatasetEventRef,
      args: {
        eventId: t.arg.id({ required: true }),
        status: t.arg({ type: ResponseStatusType, required: true }),
      },
      resolve: (root, args, ctx) =>
        processContributorCitation(root, args as never, ctx as never) as never,
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
        updateWorkerTask(root, args as never, ctx as never) as never,
    }),
  }),
})
