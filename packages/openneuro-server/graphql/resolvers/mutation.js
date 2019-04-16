/**
 * All top level mutations
 */
import {
  createDataset,
  deleteDataset,
  updateFiles,
  deleteFile,
  deleteFiles,
  updatePublic,
  trackAnalytics,
} from './dataset.js'
import {
  createSnapshot,
  deleteSnapshot,
  updateSnapshotFileUrls,
} from './snapshots.js'
import { removeUser, setAdmin, setBlocked } from './user.js'
import { updateSummary } from './summary.js'
import { updateValidation } from './validation.js'
import { updatePermissions, removePermissions } from './permissions.js'
import { followDataset } from './follow.js'
import { starDataset } from './stars.js'
import { publishDataset } from './publish.js'
import { updateDescription, updateDescriptionList } from './description.js'
import { updateReadme } from './readme.js'
import { addComment, editComment } from './comment.js'

const Mutation = {
  createDataset,
  deleteDataset,
  updateFiles,
  deleteFile,
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
}

export default Mutation
