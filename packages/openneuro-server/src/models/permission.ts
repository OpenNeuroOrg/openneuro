import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface PermissionDocument extends Document {
  datasetId: string
  userId: string
  level: string
}

const permissionSchema = new Schema({
  datasetId: { type: String, required: true },
  userId: { type: String, required: true },
  level: { type: String, required: true, enum: ['ro', 'rw', 'admin'] },
})

const Permission = model<PermissionDocument>('Permission', permissionSchema)

export default Permission
