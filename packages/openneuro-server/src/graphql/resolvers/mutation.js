/**
 * All top level mutations
 */
import {
  createDataset,
  deleteDataset,
  deleteFile,
  deleteFiles,
  updatePublic,
  trackAnalytics,
} from './dataset.js'
import { updateRef } from './draft.js'
import { createSnapshot, deleteSnapshot } from './snapshots.js'
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
import { prepareRepoAccess } from './git.ts'
import { cacheClear } from './cache'

const Mutation = {
  createDataset,
  deleteDataset,
  deleteFile,
  deleteFiles,
  createSnapshot,
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
}

export default Mutation
