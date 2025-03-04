import { v4 as uuidv4 } from "uuid"
import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface UserDocument extends Document {
  _id: string
  id: string
  email: string
  name: string
  provider: StaticRangeInit
  providerId: string
  orcid: string
  refresh: string
  admin: boolean
  blocked: boolean
  created: Date
  lastSeen: Date
  location: string
  institution: string
  github: string
  links: string[]
}

const userSchema = new Schema({
  id: { type: String, default: uuidv4 }, // OpenNeuro id
  email: String,
  name: String,
  provider: String, // Login provider
  providerId: String, // Login provider unique id
  orcid: String, // ORCID iD regardless of provider id
  refresh: String,
  admin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  location: { type: String, default: "" },
  institution: { type: String, default: "" },
  github: { type: String, default: "" },
  links: { type: [String], default: [] },
})

userSchema.index({ id: 1, provider: 1 }, { unique: true })
// Allow case-insensitive email queries
userSchema.index(
  { email: 1 },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  },
)

const User = model<UserDocument>("User", userSchema)

export default User
