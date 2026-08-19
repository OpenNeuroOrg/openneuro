import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

/**
 * A dataset published as a work on one user's ORCID record.
 *
 * Tracking the put-code lets a later sync update the existing work instead of
 * adding a duplicate, and the hash lets us skip ORCID writes for datasets that
 * have not changed since the last sync.
 */
export interface OrcidWorkDocument extends Document {
  // OpenNeuro user id the work belongs to
  userId: string
  // ORCID iD the work was written to
  orcid: string
  // Dataset accession number
  datasetId: string
  // ORCID assigned identifier for this work
  putCode: number
  // Snapshot tag the published metadata came from
  snapshotTag: string
  // DOI of that snapshot, when one has been minted
  doi?: string
  // Hash of the last work payload sent to ORCID
  hash: string
  updatedAt: Date
}

const orcidWorkSchema = new Schema<OrcidWorkDocument>({
  userId: { type: String, required: true },
  orcid: { type: String, required: true },
  datasetId: { type: String, required: true },
  putCode: { type: Number, required: true },
  snapshotTag: { type: String, required: true },
  doi: { type: String },
  hash: { type: String, required: true },
}, { timestamps: { createdAt: false, updatedAt: true } })

orcidWorkSchema.index({ userId: 1, datasetId: 1 }, { unique: true })

const OrcidWork = model<OrcidWorkDocument>("OrcidWork", orcidWorkSchema)

export default OrcidWork
