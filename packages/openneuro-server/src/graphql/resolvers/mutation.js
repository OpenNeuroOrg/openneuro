/**
 * All top level mutations
 */
import {
  createDataset,
  deleteDataset,
  deleteFiles,
  removeAnnexObject,
  flagAnnexObject,
  updatePublic,
  trackAnalytics,
} from './dataset.js'
import { updateRef } from './draft.js'
import {
  createSnapshot,
  deleteSnapshot,
  deprecateSnapshot,
} from './snapshots.js'
import { removeUser, setAdmin, setBlocked } from './user.js'
import { updateSummary } from './summary.js'
import { revalidate, updateValidation } from './validation.js'
import { updatePermissions, removePermissions } from './permissions.js'
import { followDataset } from './follow.js'
import { starDataset } from './stars.js'
import { publishDataset } from './publish.js'
import { updateDescription, updateDescriptionList } from './description.js'
import { updateReadme } from './readme.js'
import { addComment, editComment, deleteComment } from './comment.js'
import { subscribeToNewsletter } from './newsletter'
import { addMetadata } from './metadata.js'
import { prepareUpload, finishUpload } from './upload.js'
import { prepareRepoAccess } from './git'
import { cacheClear } from './cache'
import { reexportRemotes } from './reexporter'
import { resetDraft } from './reset'
import { createReviewer, deleteReviewer } from './reviewer'
import { createRelation, deleteRelation } from './relation'

const Mutation = {
  createDataset,
  deleteDataset,
  deleteFiles,
  removeAnnexObject,
  flagAnnexObject,
  createSnapshot,
  deprecateSnapshot,
  deleteSnapshot,
  updateSummary,
  updateValidation,
  updatePublic,
  updatePermissions,
  removePermissions,
  removeUser,
  setAdmin,
  setBlocked,
  trackAnalytics,
  followDataset,
  starDataset,
  publishDataset,
  updateDescription,
  updateDescriptionList,
  updateReadme,
  addComment,
  editComment,
  deleteComment,
  subscribeToNewsletter,
  addMetadata,
  updateRef,
  prepareUpload,
  finishUpload,
  cacheClear,
  revalidate,
  prepareRepoAccess,
  reexportRemotes,
  resetDraft,
  createReviewer,
  deleteReviewer,
  createRelation,
  deleteRelation,
}

export default Mutation
