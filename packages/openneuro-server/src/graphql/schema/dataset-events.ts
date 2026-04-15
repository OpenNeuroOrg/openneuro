import { DatasetEventDescriptionRef, DatasetEventRef, UserRef } from "./refs"
import { ResponseStatusType } from "./enums"
import { UserNotificationStatus } from "./misc"
import { Contributor } from "./description"
import {
  DatasetEventDescriptionTypeResolvers,
  DatasetEventTypeResolvers,
} from "../resolvers/datasetEvents"

DatasetEventDescriptionRef.implement({
  fields: (t) => ({
    type: t.string({ resolve: (obj) => obj.type }),
    version: t.string({
      resolve: (obj) => "version" in obj ? obj.version : null,
    }),
    public: t.boolean({
      resolve: (obj) => "public" in obj ? obj.public : null,
    }),
    target: t.field({
      type: UserRef,
      resolve: (obj) => ("target" in obj ? obj.target : null) as never,
    }),
    targetUserId: t.id({
      resolve: (obj) => "targetUserId" in obj ? obj.targetUserId : null,
    }),
    level: t.string({
      resolve: (obj) => "level" in obj ? obj.level : null,
    }),
    ref: t.string({
      resolve: (obj) => "reference" in obj ? obj.reference : null,
    }),
    message: t.string({
      resolve: () => null,
    }),
    requestId: t.id({
      resolve: (obj) => "requestId" in obj ? obj.requestId : null,
    }),
    reason: t.string({
      resolve: (obj) => "reason" in obj ? obj.reason : null,
    }),
    datasetId: t.id({
      resolve: (obj) => "datasetId" in obj ? obj.datasetId : null,
    }),
    resolutionStatus: t.field({
      type: ResponseStatusType,
      resolve: (obj) =>
        DatasetEventDescriptionTypeResolvers.resolutionStatus(
          obj as {
            resolutionStatus?: "pending" | "accepted" | "denied" | null
          },
        ),
    }),
    contributorData: t.field({
      type: Contributor,
      resolve: (obj) =>
        "contributorData" in obj ? obj.contributorData as never : null,
    }),
  }),
})

DatasetEventRef.implement({
  fields: (t) => ({
    id: t.id({ resolve: (obj) => obj.id }),
    timestamp: t.field({
      type: "DateTime",
      resolve: (obj) => obj.timestamp as unknown as string,
    }),
    user: t.field({
      type: UserRef,
      resolve: (obj) => obj.user as never,
    }),
    event: t.field({
      type: DatasetEventDescriptionRef,
      resolve: (obj) => obj.event,
    }),
    success: t.boolean({ resolve: (obj) => obj.success }),
    note: t.string({ resolve: (obj) => obj.note }),
    datasetId: t.id({ resolve: (obj) => obj.datasetId }),
    notificationStatus: t.field({
      type: UserNotificationStatus,
      resolve: (obj) => obj.notificationStatus as never,
    }),
    responseStatus: t.field({
      type: ResponseStatusType,
      resolve: (ev) => DatasetEventTypeResolvers.responseStatus(ev),
    }),
    hasBeenRespondedTo: t.boolean({
      resolve: (ev) => DatasetEventTypeResolvers.hasBeenRespondedTo(ev),
    }),
  }),
})
