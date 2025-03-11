import User from "../../models/user"
import type { UserDocument } from "../../models/user"
import Permission from "../../models/permission"
import type { PermissionDocument } from "../../models/permission"
import { checkDatasetAdmin } from "../permissions"
import { user } from "./user"
import { createEvent, updateEvent } from "../../libs/events"

interface DatasetPermission {
  id: string
  userPermissions: (PermissionDocument & { user: Promise<UserDocument> })[]
}

export async function permissions(ds): Promise<DatasetPermission> {
  const permissions = await Permission.find({ datasetId: ds.id }).exec()
  return {
    id: ds.id,
    userPermissions: permissions.map(
      (userPermission) => ({
        ...userPermission.toJSON(),
        user: user(ds, { id: userPermission.userId }),
      } as unknown as PermissionDocument & { user: Promise<UserDocument> }),
    ),
  }
}

const publishPermissions = async (datasetId) => {
  // Create permissionsUpdated object with DatasetPermissions in Dataset
  // and resolve all promises before publishing
  const ds = { id: datasetId }
  const { id, userPermissions } = await permissions(ds)
  const permissionsUpdated = {
    id,
    userPermissions: await Promise.all(
      userPermissions.map(async (userPermission) => ({
        ...userPermission,
        user: await user(ds, { id: userPermission.userId }),
      })),
    ),
  }
  return permissionsUpdated
}

/**
 * Apply permission updates to a list of users
 */
async function updateUsers(datasetId: string, level: string, users) {
  for (const user of users) {
    const event = await createEvent(datasetId, user, {
      type: "permissionChange",
      target: user.id,
      level: level,
    })
    await Permission.updateOne(
      {
        datasetId: datasetId,
        userId: user.id,
      },
      {
        datasetId: datasetId,
        userId: user.id,
        level: level,
      },
      { upsert: true },
    ).exec()
    await updateEvent(event)
  }
  return publishPermissions(datasetId)
}

/**
 * Update user permissions on a dataset
 */
export const updatePermissions = async (obj, args, { user, userInfo }) => {
  await checkDatasetAdmin(args.datasetId, user, userInfo)
  // get all users the the email specified by permissions arg
  const users = await User.find({ email: args.userEmail })
    .collation({ locale: "en", strength: 2 })
    .exec()

  if (!users.length) {
    throw new Error("A user with that email address does not exist")
  }

  return updateUsers(args.datasetId, args.level, users)
}

/**
 * ORCID variant of updatePermissions
 */
export const updateOrcidPermissions = async (obj, args, { user, userInfo }) => {
  await checkDatasetAdmin(args.datasetId, user, userInfo)
  // Get all users associated with the ORCID provided
  const users = await User.find({
    "$or": [{ "orcid": args.userOrcid }, {
      "providerId": args.userOrcid,
      "provider": "orcid",
    }],
  })
    .collation({ locale: "en", strength: 2 })
    .exec()

  if (!users.length) {
    throw new Error("A user with that ORCID does not exist")
  }

  return updateUsers(args.datasetId, args.level, users)
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
