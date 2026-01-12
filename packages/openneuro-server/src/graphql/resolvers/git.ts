import { checkDatasetRead, checkDatasetWrite } from "../permissions.js"
import { generateRepoToken } from "../../libs/authentication/jwt"
import { getDatasetEndpoint } from "../../libs/datalad-service.js"

/**
 * Generate a short lived token for git operations
 * @param _ Root only resolver with unused parent
 * @param args
 * @param args.datasetId Dataset accession number
 * @param context
 * @param context.user User id
 * @param context.userInfo Decoded token values
 */
export async function prepareRepoAccess(
  _: Record<string, unknown>,
  { datasetId }: { datasetId: string },
  { user, userInfo }: { user: string; userInfo: Record<string, unknown> },
): Promise<{ token: string; endpoint: number }> {
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
    return {
      token: generateRepoToken(userInfo, datasetId, false),
      endpoint: getDatasetEndpoint(datasetId),
    }
  } catch {
    await checkDatasetRead(datasetId, user, userInfo)
    return {
      token: generateRepoToken(userInfo, datasetId),
      endpoint: getDatasetEndpoint(datasetId),
    }
  }
}
