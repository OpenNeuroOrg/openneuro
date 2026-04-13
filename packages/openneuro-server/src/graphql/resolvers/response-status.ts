/**
 * Case mapping between the DB representation of resolutionStatus
 * (lowercase: "pending" | "accepted" | "denied") and the GraphQL
 * SDL enum ResponseStatusType (uppercase: "PENDING" | "ACCEPTED" | "DENIED").
 *
 * The DB layer enforces lowercase via Mongoose enum at
 * packages/openneuro-server/src/models/datasetEvents.ts. These helpers mediate
 * between that persisted representation and the typed GraphQL surface.
 */

export type DbStatus = "pending" | "accepted" | "denied"
export type GraphqlStatus = "PENDING" | "ACCEPTED" | "DENIED"

const DB_TO_GRAPHQL: Record<DbStatus, GraphqlStatus> = {
  pending: "PENDING",
  accepted: "ACCEPTED",
  denied: "DENIED",
}

const GRAPHQL_TO_DB: Record<GraphqlStatus, DbStatus> = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DENIED: "denied",
}

export function toGraphqlStatus(
  value: DbStatus | null | undefined,
): GraphqlStatus | null {
  if (value === null || value === undefined) return null
  const mapped = DB_TO_GRAPHQL[value]
  if (!mapped) {
    throw new Error(`toGraphqlStatus: unrecognized DB status value '${value}'`)
  }
  return mapped
}

export function toDbStatus(value: GraphqlStatus): DbStatus {
  const mapped = GRAPHQL_TO_DB[value]
  if (!mapped) {
    throw new Error(`toDbStatus: unrecognized GraphQL status value '${value}'`)
  }
  return mapped
}
