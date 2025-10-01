import config from "../config"
import { GraphQLError } from "graphql"
import Permission from "../models/permission"
import Dataset from "../models/dataset"
import Deletion from "../models/deletion"

// Definitions for permission levels allowed
// Admin is write + manage user permissions
export const states = {
  READ: {
    errorMessage: "You do not have access to read this dataset.",
    allowed: ["ro", "rw", "admin"],
  },
  WRITE: {
    errorMessage: "You do not have access to modify this dataset.",
    allowed: ["rw", "admin"],
  },
  ADMIN: {
    errorMessage: "You do not have admin access to this dataset.",
    allowed: ["admin"],
  },
}

/**
 * Query to check if datasets exist and are accessible due to public flag
 * @param {string} datasetId
 * @param {string} userId
 * @param {object} userInfo
 * @returns {object} MongoDB query object
 */
export const datasetReadQuery = (datasetId, userId, userInfo) => {
  if (!userId || (userInfo && !userInfo.admin)) {
    return { id: datasetId, public: true }
  } else {
    return { id: datasetId }
  }
}

/**
 * Check for permission levels
 * @param {object} permission Permission object
 * @param {object} permission.level Field defining the current permission
 * @param {object} state Permission state type
 * @param {object} state.allowed Levels allowed for this permission state
 * @returns {boolean} Access allowed
 */
export const checkPermissionLevel = (permission, state) => {
  if (permission && state.allowed.includes(permission.level)) {
    return true
  } else {
    return false
  }
}

export class DeletedDatasetError extends GraphQLError {
  constructor(datasetId, reason, redirect = undefined) {
    let extensions
    if (redirect) {
      try {
        // Validate URL before we attach it to the API response
        const canonical = new URL(config.url)
        const url = new URL(redirect)
        if (
          url.hostname === canonical.hostname &&
          url.pathname.startsWith("/datasets")
        ) {
          // Only return a relative path to avoid cross site risks
          extensions = { code: "DELETED_DATASET", redirect: url.pathname }
        }
      } catch (_err) {
        // Do nothing
      }
    }
    super(`Dataset ${datasetId} has been deleted. Reason: ${reason}.`, {
      extensions,
    })
  }
}

export const checkDatasetExists = async (datasetId) => {
  const deleted = await Deletion.findOne({ datasetId }).exec()
  if (deleted) {
    throw new DeletedDatasetError(datasetId, deleted.reason, deleted.redirect)
  }
  const found = await Dataset.countDocuments({ id: datasetId }).exec()
  if (!found) throw new Error(`Dataset ${datasetId} does not exist.`)
}

export const checkDatasetRead = async (datasetId, userId, userInfo) => {
  // indexer has universal read access
  if (userInfo?.indexer) return true
  // Reviewers are anonymous users with single dataset read access
  if (userInfo?.reviewer) {
    if (userInfo.dataset === datasetId) {
      return true
    }
  }
  // Check that dataset exists.
  await checkDatasetExists(datasetId)
  // Look for any matching datasets
  const datasetFound = await Dataset.findOne(
    datasetReadQuery(datasetId, userId, userInfo),
  ).exec()
  // Found a dataset and don't need to match further (public or admin user)
  if (datasetFound) {
    return true
  } else {
    // Did not find a dataset, check permissions for additional read access
    const permission = await Permission.findOne({ datasetId, userId }).exec()
    if (checkPermissionLevel(permission, states.READ)) {
      return true
    } else {
      throw new Error(states.READ.errorMessage)
    }
  }
}

/**
 * General verification of dataset permission given a dataset and user
 * @param {string} datasetId Accession number for dataset
 * @param {string} userId User UUID
 * @param {object} userInfo User details object
 * @param {object} state Level to verify
 */

export const checkDatasetWrite = async (
  datasetId,
  userId,
  userInfo,
  state = states.WRITE,
  options = { checkExists: true },
) => {
  if (options.checkExists) {
    // Check that dataset exists.
    await checkDatasetExists(datasetId)
  }
  if (!userId) {
    // Quick path for anonymous writes
    throw new Error(state.errorMessage)
  }
  if (userId && userInfo.admin) {
    // Always allow site admins
    return true
  }
  // Allow worker scoped tokens to make admin actions on specific datasets
  if (userId && userInfo?.worker && datasetId === userInfo?.dataset) {
    return true
  }
  if (userId && !(userInfo.email)) {
    throw new Error("Connect an email to make contributions to OpenNeuro.")
  }
  // Finally check the permissions model if other checks have not returned
  const permission = await Permission.findOne({ datasetId, userId }).exec()
  if (checkPermissionLevel(permission, state)) {
    return true
  } else {
    throw new Error(state.errorMessage)
  }
}

export const checkDatasetAdmin = (
  datasetId,
  userId,
  userInfo,
  options = { checkExists: true },
) => checkDatasetWrite(datasetId, userId, userInfo, states.ADMIN, options)

export const checkAdmin = (userId, userInfo) =>
  userId && userInfo.admin
    ? Promise.resolve(true)
    : Promise.reject(states.ADMIN.errorMessage)

/**
 * Check if the user is a worker
 * @param userInfo User context
 */
export const checkWorker = (userInfo) => {
  if (userInfo?.worker) return true
  else throw new Error("You must be a worker to make this request.")
}
