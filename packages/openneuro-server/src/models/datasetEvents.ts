import mongoose from "mongoose"
import type { Document } from "mongoose"
import type { OpenNeuroUserId } from "../types/user"
import { v4 as uuidv4 } from "uuid"
import type { UserDocument } from "./user"
import type { UserNotificationStatusDocument } from "./userNotificationStatus"
const { Schema, model } = mongoose

const _datasetEventTypes = [
  "created",
  "versioned",
  "deleted",
  "published",
  "permissionChange",
  "git",
  "upload",
  "note",
  "contributorRequest",
  "contributorCitation",
  "contributorRequestResponse",
  "contributorCitationResponse",
] as const

/**
 * Various events that occur affecting one dataset
 *
 * created - Dataset was created
 * versioned - Dataset has a snapshot created
 * deleted - The dataset was deleted
 * published - Dataset was made public
 * permissionChange - Dataset permissions were modified
 * git - A git event modified the dataset's repository (git history provides details)
 * upload - A non-git upload occurred (typically one file changed)
 * note - A note unrelated to another event
 * contributorRequest - a request event is created for user access
 * contributorResponse - response of deny or accept is granted
 */
export type DatasetEventName = typeof _datasetEventTypes[number]

export type DatasetEventCommon = {
  type: DatasetEventName
}

export type DatasetEventCreated = DatasetEventCommon & {
  type: "created"
  datasetId?: string
}

export type DatasetEventVersioned = DatasetEventCommon & {
  type: "versioned"
  version: string
  datasetId?: string
}

export type DatasetEventDeleted = DatasetEventCommon & {
  type: "deleted"
  datasetId?: string
}

export type DatasetEventPublished = DatasetEventCommon & {
  type: "published"
  public: boolean
  datasetId?: string
}

export type DatasetEventPermissionChange = DatasetEventCommon & {
  type: "permissionChange"
  target: OpenNeuroUserId
  level: string
  datasetId?: string
}

export type DatasetEventGit = DatasetEventCommon & {
  type: "git"
  commit: string
  reference: string
  datasetId?: string
}

export type DatasetEventUpload = DatasetEventCommon & {
  type: "upload"
  datasetId?: string
}

export type DatasetEventNote = DatasetEventCommon & {
  type: "note"
  admin: boolean
  datasetId?: string
}
export interface ContributorDataInput {
  orcid?: string
  name?: string
  email?: string
  userId?: string
  contributorType?: string
  givenName?: string
  familyName?: string
}

export type DatasetEventContributorRequest = DatasetEventCommon & {
  type: "contributorRequest"
  requestId?: string
  resolutionStatus?: "pending" | "accepted" | "denied"
  datasetId?: string
  contributorData: ContributorDataInput
}

export type DatasetEventContributorRequestResponse = DatasetEventCommon & {
  type: "contributorRequestResponse"
  requestId: string
  targetUserId: OpenNeuroUserId
  resolutionStatus: "pending" | "accepted" | "denied"
  reason?: string
  datasetId?: string
  contributorData?: ContributorDataInput
}

export type DatasetEventContributorCitationResponse = DatasetEventCommon & {
  type: "contributorCitationResponse"
  originalCitationId: string
  resolutionStatus: "pending" | "accepted" | "denied"
  datasetId: string
  addedBy: OpenNeuroUserId
  targetUserId: OpenNeuroUserId
  contributorData: ContributorDataInput
}

export type DatasetEventContributorCitation = DatasetEventCommon & {
  type: "contributorCitation"
  datasetId: string
  addedBy: OpenNeuroUserId
  targetUserId: OpenNeuroUserId
  contributorData: ContributorDataInput
  resolutionStatus: "pending" | "accepted" | "denied"
}

/**
 * Description of a dataset event
 */
export type DatasetEventType =
  | DatasetEventCreated
  | DatasetEventVersioned
  | DatasetEventDeleted
  | DatasetEventPublished
  | DatasetEventPermissionChange
  | DatasetEventGit
  | DatasetEventUpload
  | DatasetEventNote
  | DatasetEventContributorRequest
  | DatasetEventContributorCitation
  | DatasetEventContributorRequestResponse
  | DatasetEventContributorCitationResponse

/**
 * Dataset events log changes to a dataset
 */
export interface DatasetEventDocument extends Document {
  id: string
  datasetId: string
  timestamp: Date
  userId: string
  user: UserDocument
  event: DatasetEventType
  success: boolean
  note: string
  responseStatus?: "pending" | "accepted" | "denied" | null
  notificationStatus?: UserNotificationStatusDocument | null
}

const datasetEventSchema = new Schema<DatasetEventDocument>(
  {
    id: { type: String, required: true, default: uuidv4 },
    datasetId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    event: {
      type: { type: String, required: true, enum: _datasetEventTypes },
      version: { type: String },
      public: { type: Boolean },
      target: { type: String },
      level: { type: String },
      commit: { type: String },
      reference: { type: String },
      admin: { type: Boolean, default: false },
      requestId: { type: String, sparse: true, index: true },
      targetUserId: { type: String },
      reason: { type: String },
      datasetId: { type: String },
      resolutionStatus: {
        type: String,
        enum: ["pending", "accepted", "denied"],
        default: "pending",
      },
      contributorData: {
        orcid: { type: String },
        name: { type: String },
        email: { type: String },
        userId: { type: String },
        contributorType: { type: String },
        givenName: { type: String },
        familyName: { type: String },
        default: {},
      },
    },
    success: { type: Boolean, default: false },
    note: { type: String, default: "" },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)

// Virtual for the user who triggered the event
datasetEventSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "id",
  justOne: true,
})

datasetEventSchema.add({
  responseStatus: {
    type: String,
    enum: ["pending", "accepted", "denied"],
    default: null,
  },
})

// Virtual for the notification status associated with this event
datasetEventSchema.virtual("notificationStatus", {
  ref: "UserNotificationStatus",
  localField: "id",
  foreignField: "datasetEventId",
  justOne: true,
})

const DatasetEvent = model<DatasetEventDocument>(
  "DatasetEvent",
  datasetEventSchema,
)

export default DatasetEvent
