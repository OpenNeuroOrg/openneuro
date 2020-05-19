import mongoose from 'mongoose'

const permissionSchema = new mongoose.Schema({
  datasetId: { type: String, required: true },
  userId: { type: String, required: true },
  level: { type: String, required: true, enum: ['ro', 'rw', 'admin'] },
})

const Permission = mongoose.model('Permission', permissionSchema)

export default Permission
