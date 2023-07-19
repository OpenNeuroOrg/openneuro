import User, { UserDocument } from '../../models/user'
import Permission, { PermissionDocument } from '../../models/permission'
import { checkDatasetAdmin } from '../permissions'
import { user } from './user'
import pubsub from '../pubsub.js'

interface DatasetPermission {
  id: string
  userPermissions: (PermissionDocument & { user: Promise<UserDocument> })[]
}

export async function permissions(ds): Promise<DatasetPermission> {
  const permissions = await Permission.find({ datasetId: ds.id }).exec()
  return {
    id: ds.id,
    userPermissions: permissions.map(
      userPermission =>
        ({
          ...userPermission.toJSON(),
          user: user(ds, { id: userPermission.userId }),
        } as PermissionDocument & { user: Promise<UserDocument> }),
    ),
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
  const users = await User.find({ email: args.userEmail })
    .collation({ locale: 'en', strength: 2 })
    .exec()

  if (!users.length) {
    throw new Error('A user with that email address does not exist')
  }

  const userPromises = users.map(user => {
    return new Promise<void>((resolve, reject) => {
      Permission.updateOne(
        {
          datasetId: args.datasetId,
          userId: user.id,
        },
        {
          datasetId: args.datasetId,
          userId: user.id,
          level: args.level,
        },
        { upsert: true },
      )
        .exec()
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
  return Permission.deleteOne({
    datasetId: args.datasetId,
    userId: args.userId,
  })
    .exec()
    .then(() => publishPermissions(args.datasetId))
}
