import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLUpload } from 'apollo-upload-server'
import GraphQLBigInt from 'graphql-bigint'
import {
  dataset,
  datasets,
  createDataset,
  deleteDataset,
  createSnapshot,
  deleteSnapshot,
  updatePublic,
  updateFiles,
  deleteFiles,
  updateSnapshotFileUrls,
  analytics,
  trackAnalytics,
} from './dataset.js'
import { draft, partial } from './draft.js'
import { updateSummary, updateValidation } from './validation.js'
import { snapshot, snapshots } from './snapshots.js'
import { whoami, user, users, removeUser, setAdmin } from './user.js'
import {
  permissions,
  updatePermissions,
  removePermissions,
} from './permissions.js'
import {
  datasetDeleted,
  datasetValidationUpdated,
  draftFilesUpdated,
  snapshotAdded,
  snapshotDeleted,
  permissionsUpdated,
} from './subscriptions.js'

export default {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  Upload: GraphQLUpload,
  BigInt: GraphQLBigInt,
  Query: {
    dataset,
    datasets,
    whoami,
    user,
    users,
    snapshot,
    partial,
  },
  Mutation: {
    createDataset,
    updateFiles,
    deleteDataset,
    deleteFiles,
    createSnapshot,
    deleteSnapshot,
    updateSummary,
    updateValidation,
    updateSnapshotFileUrls,
    updatePublic,
    updatePermissions,
    removePermissions,
    removeUser,
    setAdmin,
    trackAnalytics,
  },
  Subscription: {
    datasetDeleted,
    datasetValidationUpdated,
    draftFilesUpdated,
    snapshotAdded,
    snapshotDeleted,
    permissionsUpdated,
  },
  User: user,
  Dataset: {
    uploader: ds => user(ds, { id: ds.uploader }),
    draft,
    snapshots,
    analytics: ds => analytics(ds),
    permissions: ds =>
      permissions(ds).then(p =>
        p.map(permission =>
          Object.assign(permission, {
            user: user(ds, { id: permission.userId }),
          }),
        ),
      ),
  },
  Snapshot: {
    analytics: snapshot => analytics(snapshot),
  },
}
