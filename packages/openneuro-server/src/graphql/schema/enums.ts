import { builder } from "../builder"

export const CacheControlScope = builder.enumType("CacheControlScope", {
  values: ["PUBLIC", "PRIVATE"] as const,
})

export const SortOrdering = builder.enumType("SortOrdering", {
  values: ["ascending", "descending"] as const,
})

export const UserProvider = builder.enumType("UserProvider", {
  description: "Which provider a user login comes from",
  values: ["google", "orcid"] as const,
})

export const AnalyticTypes = builder.enumType("AnalyticTypes", {
  values: ["downloads", "views"] as const,
})

export const ResponseStatusType = builder.enumType("ResponseStatusType", {
  values: ["PENDING", "ACCEPTED", "DENIED"] as const,
})

export const NotificationStatusType = builder.enumType(
  "NotificationStatusType",
  {
    values: ["UNREAD", "SAVED", "ARCHIVED"] as const,
  },
)

export const Severity = builder.enumType("Severity", {
  values: ["error", "warning"] as const,
})

export const RelatedObjectRelation = builder.enumType(
  "RelatedObjectRelation",
  {
    description: "RelatedObject nature of relationship",
    values: ["sameAs", "derivative", "source"] as const,
  },
)

export const RelatedObjectKind = builder.enumType("RelatedObjectKind", {
  description: "RelatedObject kind of target object",
  values: ["Dataset", "Article"] as const,
})
