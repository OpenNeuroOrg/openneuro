/**
 * Resolver for rerunning remote exports.
 */
import { checkAdmin } from "../permissions"
import { runReexporter } from "../../datalad/reexporter"

export const reexportRemotes = async (
  obj,
  { datasetId },
  { user, userInfo },
) => {
  await checkAdmin(user, userInfo)
  await runReexporter(datasetId)
  return true
}
