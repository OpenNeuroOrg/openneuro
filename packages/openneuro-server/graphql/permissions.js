import Permission from './../models/permission'
import mongo from '../libs/mongo.js'

const c = mongo.collections

export const checkDatasetRead = (datasetId, userId, userInfo) => {
  const query = { id: datasetId }
  if (!userInfo.admin) {
    query.public = true
  }
  return c.crn.datasets.findOne(query).then(datasetFound => {
    if (datasetFound) {
      return true
    } else {
      return Permission.findOne({ datasetId, userId }).then(permission => {
        if (
          permission &&
          (permission.level === 'admin' ||
            permission.level === 'rw' ||
            permission.level === 'ro')
        ) {
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
    return Promise.reject(writeErrorMessage)
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
