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

const publishPermissions = async datasetId => {
  // Create permissionsUpdated object with DatasetPermissions in Dataset
  // and resolve all promises before publishing
  const ds = { id: datasetId }
  const { id, userPermissions } = await permissions(ds)
  const permissionsUpdated = {
    id: datasetId,
    permissions: {
      id,
      userPermissions: await Promise.all(
        userPermissions.map(async userPermission => ({
          ...userPermission,
          user: await user(ds, { id: userPermission.userId }),
        })),
      ),
    },
  }
  pubsub.publish('permissionsUpdated', {
    datasetId,
    permissionsUpdated,
  })
}

/**
 * Update user permissions on a dataset
 */
export const updatePermissions = async (obj, args, { user, userInfo }) => {
  await checkDatasetAdmin(args.datasetId, user, userInfo)
  // get all users the the email specified by permissions arg
  const users = await User.find({ email: args.userEmail }).exec()
  const userPromises = users.map(user => {
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
  return Promise.all(userPromises).then(() =>
    publishPermissions(args.datasetId),
  )
}

/**
 * Remove user permissions on a dataset
 */
export const removePermissions = (obj, args) => {
  return mongo.collections.crn.permissions
    .deleteOne({
      datasetId: args.datasetId,
      userId: args.userId,
    })
    .then(() => publishPermissions(args.datasetId))
}
