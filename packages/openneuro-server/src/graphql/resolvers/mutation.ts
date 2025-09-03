/**
 * All top level mutations
 */
import {
  createDataset,
  deleteDataset,
  deleteFiles,
  flagAnnexObject,
  removeAnnexObject,
  trackAnalytics,
  updatePublic,
} from "./dataset.js"
import {
  createSnapshot,
  deleteSnapshot,
  deprecateSnapshot,
  undoDeprecateSnapshot,
} from "./snapshots.js"
import { removeUser, setAdmin, setBlocked, updateUser } from "./user.js"
import { updateSummary } from "./summary"
import { revalidate, updateValidation } from "./validation.js"
import {
  removePermissions,
  updateOrcidPermissions,
  updatePermissions,
} from "./permissions"
import { followDataset } from "./follow.js"
import { starDataset } from "./stars.js"
import { publishDataset } from "./publish.js"
import { updateDescription, updateDescriptionList } from "./description.js"
import { updateReadme } from "./readme.js"
import { addComment, deleteComment, editComment } from "./comment.js"
import { subscribeToNewsletter } from "./newsletter"
import { addMetadata } from "./metadata"
import { finishUpload, prepareUpload } from "./upload.js"
import { prepareRepoAccess } from "./git"
import { cacheClear } from "./cache"
import { reexportRemotes } from "./reexporter"
import { resetDraft } from "./reset"
import { createReviewer, deleteReviewer } from "./reviewer"
import { createRelation, deleteRelation } from "./relation"
import {
  finishImportRemoteDataset,
  importRemoteDataset,
} from "./importRemoteDataset"
import { saveAdminNote } from "./datasetEvents"
import { createGitEvent } from "./gitEvents"
import { updateFileCheck } from "./fileCheck"
import { updateWorkerTask } from "./worker"

const Mutation = {
  createDataset,
  deleteDataset,
  deleteFiles,
  removeAnnexObject,
  flagAnnexObject,
  createSnapshot,
  deprecateSnapshot,
  undoDeprecateSnapshot,
  deleteSnapshot,
  updateSummary,
  updateValidation,
  updatePublic,
  updatePermissions,
  updateOrcidPermissions,
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
  importRemoteDataset,
  finishImportRemoteDataset,
  updateUser,
  saveAdminNote,
  createGitEvent,
  updateFileCheck,
  updateWorkerTask,
}

export default Mutation
