import mongo from '../../libs/mongo.js'
import User from '../../models/user'
import { checkDatasetAdmin } from '../permissions'
import { user } from './user'
import pubsub from '../pubsub.js'

export const permissions = async ds => {
  const permissions = await mongo.collections.crn.permissions
    .find({ datasetId: ds.id })
    .toArray()
  return {
    id: ds.id,
    userPermissions: permissions.map(userPermission => ({
      ...userPermission,
      user: user(ds, { id: userPermission.userId }),
    })),
  }
}

/**
 * Update user permissions on a dataset
 */
export const updatePermissions = async (obj, args, { user, userInfo }) => {
  await checkDatasetAdmin(args.datasetId, user, userInfo)
  // get all users the the email specified by permissions arg
  let users = await User.find({ email: args.userEmail }).exec()
  let userPromises = users.map(user => {
    return new Promise((resolve, reject) => {
      mongo.collections.crn.permissions
        .updateOne(
          {
            datasetId: args.datasetId,
            userId: user.id,
          },
          {
            $set: {
              datasetId: args.datasetId,
              userId: user.id,
              level: args.level,
            },
          },
          { upsert: true },
        )
        .then(() => resolve())
        .catch(err => reject(err))
    })
  })
  return Promise.all(userPromises)
    .then(() => {
      return pubsub.publish('permissionsUpdated', { datasetId: args.datasetId })
    })
    .then(() => users[0])
}

/**
 * Remove user permissions on a dataset
 */
export const removePermissions = (obj, args) => {
  return mongo.collections.crn.permissions
    .remove({
      datasetId: args.datasetId,
      userId: args.userId,
    })
    .then(() => {
      return pubsub.publish('permissionsUpdated', { datasetId: args.datasetId })
    })
}
