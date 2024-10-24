import mongoose from "mongoose"
import type { Document } from "mongoose"
import type { UserDocument } from "./user"
const ObjectId = mongoose.Schema.Types.ObjectId

export interface BadAnnexObject extends Document {
  datasetId: string
  snapshot: string
  filepath: string
  annexKey: string
  removed: boolean
  // TODO: update any to UserDocument once #2054 Mongoose upgrade is merged
  remover: string | UserDocument
  flagged: boolean
  flagger: string | UserDocument
}

/**
 * A collection of annexed files that have been flagged and/or removed for privacy concerns.
 */
const badAnnexObject = new mongoose.Schema(
  {
    datasetId: String, // OpenNeuro id
    snapshot: String,
    filepath: String,
    annexKey: String,
    removed: { type: Boolean, default: false },
    remover: { type: ObjectId, ref: "User" },
    flagged: { type: Boolean, default: false },
    flagger: { type: ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: "created_at" } },
)

badAnnexObject.index({ datasetId: 1, annexKey: 1 }, { unique: true })

const BadAnnexObject = mongoose.model<BadAnnexObject>(
  "BadAnnexObject",
  badAnnexObject,
)

export default BadAnnexObject
