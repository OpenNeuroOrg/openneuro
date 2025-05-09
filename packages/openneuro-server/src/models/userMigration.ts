import { v4 as uuidv4 } from "uuid"
import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface UserMigrationDocument extends Document {
  _id: string
  orcid: string
  google: string
  users: object[]
  datasets: string[]
  permissions: object[]
  comments: object[]
  deletions: object[]
  success: boolean
}

const userMigrationSchema = new Schema({
  id: { type: String, default: uuidv4 }, // OpenNeuro id
  orcid: String,
  google: String,
  datasets: { type: [String], default: [] },
  permissions: { type: [Object], default: [] },
  comments: { type: [String], default: [] },
  deletions: { type: [String], default: [] },
  users: { type: [Object], default: [] },
  success: Boolean,
})

const User = model<UserMigrationDocument>("UserMigration", userMigrationSchema)

export default User
