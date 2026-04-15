import { builder } from "../builder"
import { UserRef } from "./refs"

export const Permission = builder.simpleObject("Permission", {
  fields: (t) => ({
    datasetId: t.id({ nullable: false }),
    userId: t.string({ nullable: false }),
    level: t.string({ nullable: false }),
    user: t.field({ type: UserRef }),
  }),
})

export const DatasetPermissions = builder.simpleObject("DatasetPermissions", {
  fields: (t) => ({
    id: t.id({ nullable: false }),
    userPermissions: t.field({ type: [Permission] }),
  }),
})
