/**
 * Resolver for rerunning remote exports.
 */
import { checkAdmin } from "../permissions"
import { runReexporter } from "../../datalad/reexporter"
import type { GraphQLContext } from "../builder"

export const reexportRemotes = async (
  obj,
  { datasetId },
  { user, userInfo }: GraphQLContext,
) => {
  await checkAdmin(user, userInfo)
  await runReexporter(datasetId)
  return true
}
