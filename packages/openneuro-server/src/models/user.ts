import { v4 as uuidv4 } from "uuid"
import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface UserDocument extends Document {
  _id: string
  // OpenNeuro specific user uuid
  id: string
  // Best contact email for the user (notifications)
  email: string
  // User's preferred name (visible)
  name: string
  // Login provider
  provider: StaticRangeInit
  // The id from the login provider
  providerId: string
  // ORCID iD associated with this OpenNeuro user
  orcid: string
  // Google account id associated with this OpenNeuro user
  google: string
  // Is this a migrated account? Migrated accounts were Google accounts moved to ORCID and disabled
  migrated: boolean
  refresh: string
  // Is this user a site admin with permissions for all datasets?
  admin: boolean
  // Has this user been banned from the site?
  blocked: boolean
  // Original account creation time
  created: Date
  // Last time the user authenticated
  lastSeen: Date
  // Location populated from User or Github
  location: string
  // Institution populated from ORCID
  institution: string
  // GitHub account linked
  github: string
  // User profile links
  links: string[]
  // Added for Mongoose timestamps
  updatedAt: Date
  // Avatar populated from Github
  avatar: string
  // githubSynced populated from Github OAuth use
  githubSynced: Date
  // Defaults to NULL populated from ORCID Consent Form Mutation
  orcidConsent?: boolean | null
  givenName?: string
  familyName?: string
}

const userSchema = new Schema({
  id: { type: String, default: uuidv4 }, // OpenNeuro id
  email: String,
  name: String,
  provider: String, // Login provider
  providerId: String, // Login provider unique id
  orcid: String, // ORCID iD regardless of provider id
  google: String, // Google ID if this is an ORCID account with a Google account linked
  migrated: { type: Boolean, default: false },
  refresh: String,
  avatar: String,
  admin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  location: { type: String, default: "" },
  institution: { type: String, default: "" },
  github: { type: String, default: "" },
  githubSynced: { type: Date },
  links: { type: [String], default: [] },
  orcidConsent: {
    type: Boolean,
    default: null,
  },
}, { timestamps: { createdAt: false, updatedAt: true } })

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
