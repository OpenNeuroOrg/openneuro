/**
 * Migrate permissions from SciTran datasets to new db
 */
import path from 'path'
import bidsId from '../libs/bidsId.js'
import mongo from '../libs/mongo.js'
import User from '../models/user.js'
import Permission from '../models/permission.js'

const scitran = mongo.collections.scitran

export default {
  id: path.basename(module.filename),
  update: async () => {
    const projectPermissions = await scitran.projects
      .find({}, { permissions: true })
      .toArray()
    const newPermissions = []
    for (const project of projectPermissions) {
      for (const permission of project.permissions) {
        const datasetId = bidsId.decodeId(project._id)
        if (datasetId && typeof datasetId === 'string') {
          // Check for datasetId basic assumptions
          if (datasetId.slice(0, 3) !== 'ds0') {
            throw new Error(`Invalid id "${datasetId}"`)
          }
          const providerId = permission._id
          const user = await User.findOne({ providerId })
          newPermissions.push({
            datasetId,
            userId: user.id,
            level: permission.access,
          })
        } else {
          console.log(`Skipping invalid dataset ${project._id}`)
        }
      }
    }
    Permission.collection.insert(newPermissions).catch(e => {
      throw e
    })
  },
}
