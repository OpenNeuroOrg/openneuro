import mongo from '../../libs/mongo.js'

export const permissions = obj => {
  let datasetId = obj.id
  return mongo.collections.crn.permissions
    .find({ datasetId: datasetId })
    .toArray()
}

/**
 * Update user permissions on a dataset
 */
export const updatePermissions = (obj, args) => {
  return mongo.collections.crn.permissions.updateOne(
    {
      datasetId: args.datasetId,
      userId: args.userId,
    },
    {
      $set: {
        datasetId: args.datasetId,
        userId: args.userId,
        level: args.level,
      },
    },
    { upsert: true },
  )
}

/**
 * Remove user permissions on a dataset
 */
export const removePermissions = (obj, args) => {
  return mongo.collections.crn.permissions.remove({
    datasetId: args.datasetId,
    userId: args.userId,
  })
}
