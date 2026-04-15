import { builder } from "../builder"
import { DatasetEventRef, UserRef } from "./refs"
import { UserProvider } from "./enums"
import { notifications } from "../resolvers/user"

UserRef.implement({
  description: "OpenNeuro user records from all providers",
  fields: (t) => ({
    id: t.id({ resolve: (obj) => obj.id }),
    provider: t.field({
      type: UserProvider,
      resolve: (obj) => obj.provider,
    }),
    avatar: t.string({ resolve: (obj) => obj.avatar }),
    orcid: t.string({ resolve: (obj) => obj.orcid }),
    created: t.field({
      type: "DateTime",
      nullable: false,
      resolve: (obj) => obj.created as unknown as string,
    }),
    modified: t.field({
      type: "DateTime",
      resolve: (obj) =>
        ((obj as Record<string, unknown>).updatedAt ??
          obj.modified) as unknown as string,
    }),
    lastSeen: t.field({
      type: "DateTime",
      resolve: (obj) => obj.lastSeen as unknown as string,
    }),
    email: t.string({ resolve: (obj) => obj.email }),
    name: t.string({ resolve: (obj) => obj.name }),
    admin: t.boolean({ resolve: (obj) => obj.admin }),
    blocked: t.boolean({ resolve: (obj) => obj.blocked }),
    location: t.string({ resolve: (obj) => obj.location }),
    institution: t.string({ resolve: (obj) => obj.institution }),
    github: t.string({ resolve: (obj) => obj.github }),
    githubSynced: t.field({
      type: "Date",
      resolve: (obj) => obj.githubSynced as unknown as string,
    }),
    links: t.stringList({ resolve: (obj) => obj.links }),
    notifications: t.field({
      type: [DatasetEventRef],
      nullable: { list: false, items: false },
      resolve: (obj, args, ctx) => notifications(obj, args, ctx),
    }),
    orcidConsent: t.boolean({ resolve: (obj) => obj.orcidConsent }),
  }),
})

export const UserList = builder.simpleObject("UserList", {
  fields: (t) => ({
    users: t.field({
      type: [UserRef],
      nullable: { list: false, items: false },
    }),
    totalCount: t.int({ nullable: false }),
  }),
})
