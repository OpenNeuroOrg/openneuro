import Permission from './../models/permission'
import mongo from '../libs/mongo.js'

const c = mongo.collections

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
 * Return true on matching permission level
 * @param {object} permission
 * @returns {boolean} read access
 */
export const checkReadPermissionLevel = permission => {
  if (permission && ['admin', 'rw', 'ro'].includes(permission.level)) {
    return true
  } else {
    return false
  }
}

export const checkDatasetRead = (datasetId, userId, userInfo) => {
  // Look for any matching datasets
  return c.crn.datasets
    .findOne(datasetReadQuery(datasetId, userId, userInfo))
    .then(datasetFound => {
      // Found a dataset and don't need to match further (public or admin user)
      if (datasetFound) {
        return true
      } else {
        // Did not find a dataset, check permissions for additional read access
        return Permission.findOne({ datasetId, userId }).then(permission => {
          if (checkReadPermissionLevel(permission)) {
            return true
          } else {
            throw new Error('You do not have access to read this dataset.')
          }
        })
      }
    })
}

const writeErrorMessage = 'You do not have access to modify this dataset.'

export const checkDatasetWrite = (datasetId, userId, userInfo) => {
  if (!userId) {
    // Quick path for anonymous writes
    return Promise.reject(new Error(writeErrorMessage))
  }
  if (userId && userInfo.admin) {
    // Always allow admins
    return Promise.resolve(true)
  }
  return Permission.findOne({ datasetId, userId }).then(permission => {
    if (
      permission &&
      (permission.level === 'admin' || permission.level === 'rw')
    ) {
      return true
    } else {
      throw new Error(writeErrorMessage)
    }
  })
}
