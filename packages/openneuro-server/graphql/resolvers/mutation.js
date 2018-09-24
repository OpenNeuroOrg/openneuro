/**
 * All top level mutations
 */
import {
  createDataset,
  deleteDataset,
  updateFiles,
  deleteFiles,
  updatePublic,
  trackAnalytics,
} from './dataset.js'
import {
  createSnapshot,
  deleteSnapshot,
  updateSnapshotFileUrls,
} from './snapshots.js'
import { removeUser, setAdmin } from './user.js'
import { updateSummary } from './summary.js'
import { updateValidation } from './validation.js'
import { updatePermissions, removePermissions } from './permissions.js'

const Mutation = {
  createDataset,
  deleteDataset,
  updateFiles,
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
}

export default Mutation
